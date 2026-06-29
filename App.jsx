import React, { useState } from 'react';
import { Plus, Heart, ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('landing');
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [items, setItems] = useState([]);

  // 그룹 생성
  const handleCreateGroup = (name) => {
    const newGroup = { id: Date.now(), name, code: Math.random().toString(36).substring(7).toUpperCase() };
    setGroups([...groups, newGroup]);
    setCurrentGroup(newGroup);
    setView('dashboard');
  };

  // 물건 등록
  const handleAddItem = (name, price) => {
    const newItem = { 
      id: Date.now(), 
      name, 
      price, 
      groupId: currentGroup.id, 
      liked: false 
    };
    setItems([...items, newItem]);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      {view === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-2">띱(DDIP)</h1>
          <p className="text-gray-500 mb-8">우리들만의 세컨핸드 벼룩시장</p>
          <button onClick={() => setView('create')} className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-xl font-bold mb-4 shadow-lg">그룹 만들기</button>
          <button onClick={() => setView('join')} className="w-full max-w-xs bg-white border border-blue-600 text-blue-600 py-4 rounded-xl font-bold">초대 코드로 입장</button>
        </div>
      )}

      {view === 'create' && (
        <div className="p-6">
          <button onClick={() => setView('landing')} className="mb-6"><ArrowLeft /></button>
          <h2 className="text-2xl font-bold mb-6">그룹 이름 설정</h2>
          <input type="text" placeholder="예: 제1회 벼룩모임" className="w-full p-4 border rounded-xl mb-4" id="groupName" />
          <button onClick={() => handleCreateGroup(document.getElementById('groupName').value)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">그룹 생성하기</button>
        </div>
      )}

      {view === 'dashboard' && currentGroup && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentGroup.name}</h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">코드: {currentGroup.code}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {items.filter(i => i.groupId === currentGroup.id).map(item => (
              <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border">
                <div className="bg-gray-100 h-32 rounded-lg mb-2 flex items-center justify-center text-gray-400">
                  <ImageIcon size={32} />
                </div>
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                <p className="text-blue-600 font-bold mb-2">{parseInt(item.price).toLocaleString()}원</p>
                <button className="w-full flex items-center justify-center gap-1 border py-2 rounded-lg text-sm text-gray-600">
                  <Heart size={16} /> 찜하기
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => setView('upload')} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl">
            <Plus size={24} />
          </button>
        </div>
      )}

      {view === 'upload' && (
        <div className="p-6">
          <button onClick={() => setView('dashboard')} className="mb-6"><ArrowLeft /></button>
          <h2 className="text-xl font-bold mb-6">물건 등록하기</h2>
          <div className="border-2 border-dashed rounded-xl h-40 mb-6 flex flex-col items-center justify-center text-gray-400">
            <Camera size={40} />
            <span className="text-sm mt-2">사진 추가하기</span>
          </div>
          <input type="text" placeholder="물건 이름" className="w-full p-4 border rounded-xl mb-3" id="itemName" />
          <input type="number" placeholder="가격(원)" className="w-full p-4 border rounded-xl mb-6" id="itemPrice" />
          <button 
            onClick={() => handleAddItem(document.getElementById('itemName').value, document.getElementById('itemPrice').value)} 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
          >
            등록 완료
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
