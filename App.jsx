import React, { useState, useEffect, useRef } from 'react';
import { Plus, Heart, ArrowLeft, Camera, Image as ImageIcon, X, Share2, Loader2 } from 'lucide-react';

// 로컬 스토리지 키
const STORAGE_KEY_ITEMS = 'ddip_items_data';
const STORAGE_KEY_GROUPS = 'ddip_groups_data';

const ItemCard = ({ item }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
    {item.imageUrl ? (
      <img src={item.imageUrl} alt={item.name} className="w-full h-32 rounded-xl object-cover mb-2" />
    ) : (
      <div className="bg-gray-100 h-32 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-xs">사진 없음</div>
    )}
    <h3 className="font-bold text-sm truncate">{item.name}</h3>
    <p className="text-blue-600 font-bold text-sm mb-2">{Number(item.price).toLocaleString()}원</p>
    <button className="w-full flex items-center justify-center gap-1 border py-1.5 rounded-lg text-xs hover:bg-gray-50">
      <Heart size={14} /> 찜하기
    </button>
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');
  const [currentGroup, setCurrentGroup] = useState(null);
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', groupName: '', joinCode: '' });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 초기 데이터 로드
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS) || '[]');
    const savedGroups = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS) || '[]');
    setItems(savedItems);
    setGroups(savedGroups);
  }, []);

  // 데이터 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  }, [items, groups]);

  const handleUpload = async () => {
    if (!newItem.name || !newItem.price) return;
    
    setIsUploading(true);
    
    // 로컬 데이터 추가
    const newItemEntry = {
      id: Date.now(),
      groupId: currentGroup.code,
      name: newItem.name,
      price: Number(newItem.price),
      imageUrl: previewUrl, // 로컬에서는 blob URL 사용
      createdAt: new Date().toISOString()
    };

    setItems([newItemEntry, ...items]);
    setNewItem({ ...newItem, name: '', price: '' });
    setPreviewUrl(null);
    setView('dashboard');
    setIsUploading(false);
  };

  const createGroup = () => {
    if (!newItem.groupName) return;
    const newGroup = { 
      name: newItem.groupName, 
      code: Math.random().toString(36).substring(7).toUpperCase() 
    };
    setGroups([...groups, newGroup]);
    setCurrentGroup(newGroup);
    setView('dashboard');
  };

  const joinGroup = () => {
    const foundGroup = groups.find(g => g.code === newItem.joinCode);
    if (foundGroup) {
      setCurrentGroup(foundGroup);
      setView('dashboard');
    } else {
      alert("존재하지 않는 코드입니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20">
      {view === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-2">띱(DDIP)</h1>
          <p className="text-gray-500 mb-8">우리들만의 세컨핸드 벼룩시장 (Local)</p>
          <button onClick={() => setView('create')} className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-xl font-bold mb-4">그룹 만들기</button>
          <button onClick={() => setView('join')} className="w-full max-w-xs bg-white border border-blue-600 text-blue-600 py-4 rounded-xl font-bold">초대 코드로 입장</button>
        </div>
      )}

      {view === 'create' && (
        <div className="p-6">
          <button onClick={() => setView('landing')} className="mb-4"><ArrowLeft /></button>
          <h2 className="text-xl font-bold mb-6">그룹 이름 설정</h2>
          <input className="w-full p-4 border rounded-xl mb-4" placeholder="예: 제1회 벼룩모임" onChange={e => setNewItem({...newItem, groupName: e.target.value})} />
          <button onClick={createGroup} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">그룹 생성하기</button>
        </div>
      )}

      {view === 'join' && (
        <div className="p-6">
          <button onClick={() => setView('landing')} className="mb-4"><ArrowLeft /></button>
          <h2 className="text-xl font-bold mb-6">초대 코드 입력</h2>
          <input className="w-full p-4 border rounded-xl mb-4 uppercase" placeholder="초대 코드 (예: ABC123)" onChange={e => setNewItem({...newItem, joinCode: e.target.value})} />
          <button onClick={joinGroup} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">입장하기</button>
        </div>
      )}

      {view === 'dashboard' && currentGroup && (
        <div className="p-4">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-blue-600">{currentGroup.name}</h1>
              <p className="text-xs text-gray-500">코드: {currentGroup.code}</p>
            </div>
            <button className="text-xs bg-gray-100 px-3 py-1 rounded-full font-semibold flex items-center gap-1"><Share2 size={12} /> 공유</button>
          </header>
          <div className="grid grid-cols-2 gap-4">
            {items
              .filter(i => i.groupId === currentGroup.code)
              .map(item => <ItemCard key={item.id} item={item} />)}
          </div>
          <button onClick={() => setView('upload')} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl">
            <Plus size={24} />
          </button>
        </div>
      )}

      {view === 'upload' && (
        <div className="p-6">
          <button onClick={() => setView('dashboard')} className="mb-6"><ArrowLeft /></button>
          <h2 className="text-xl font-bold mb-6">물건 등록</h2>
          <div className="mb-6">
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full h-48 rounded-xl object-cover" />
                <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={16} /></button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { fileInputRef.current.setAttribute('capture', 'camera'); fileInputRef.current.click(); }} className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl h-32 text-gray-500 hover:bg-gray-100">
                  <Camera size={28} /><span className="text-xs">바로 촬영</span>
                </button>
                <button onClick={() => { fileInputRef.current.removeAttribute('capture'); fileInputRef.current.click(); }} className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl h-32 text-gray-500 hover:bg-gray-100">
                  <ImageIcon size={28} /><span className="text-xs">사진첩 선택</span>
                </button>
              </div>
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={e => { if(e.target.files[0]) setPreviewUrl(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
          </div>
          <input className="w-full p-4 border rounded-xl mb-3" placeholder="물건 이름" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <input className="w-full p-4 border rounded-xl mb-6" placeholder="가격(원)" type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
          <button onClick={handleUpload} disabled={isUploading} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${isUploading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}>
            {isUploading ? <><Loader2 className="animate-spin" /> 저장 중...</> : '등록하기'}
          </button>
        </div>
      )}
    </div>
  );
}
