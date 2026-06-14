import React, { useState, useEffect } from 'react';
import './TodoApp.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('عام');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);

  // تحميل البيانات من Local Storage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('خطأ في تحميل المهام:', error);
      }
    }
  }, []);

  // حفظ البيانات في Local Storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // إضافة مهمة جديدة
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      priority,
      category,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
    setPriority('medium');
    setCategory('عام');
  };

  // حذف مهمة
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // تحديث حالة المهمة (مكتملة/غير مكتملة)
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // تعديل مهمة
  const updateTodo = (id: string) => {
    if (editingText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  // تصفية المهام
  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => todo.text.includes(searchTerm))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  // حساب الإحصائيات
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  // تحميل نموذج مثال
  const loadSampleTodos = () => {
    const samples: Todo[] = [
      {
        id: '1',
        text: 'إنهاء مشروع React',
        completed: false,
        createdAt: Date.now(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'high',
        category: 'عمل',
      },
      {
        id: '2',
        text: 'مراجعة الكود',
        completed: false,
        createdAt: Date.now(),
        priority: 'medium',
        category: 'عمل',
      },
      {
        id: '3',
        text: 'شراء البقالة',
        completed: true,
        createdAt: Date.now(),
        priority: 'low',
        category: 'شخصي',
      },
    ];
    setTodos(samples);
  };

  return (
    <div className="todo-container">
      <header className="todo-header">
        <div className="header-content">
          <h1>📝 قائمة المهام الذكية</h1>
          <p>أداة متقدمة لتنظيم مهامك اليومية</p>
        </div>
      </header>

      <main className="todo-main">
        {/* شريط البحث والفلترة */}
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="🔍 ابحث عن مهمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              الكل ({todos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              قيد الإنجاز ({stats.active})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              مكتملة ({stats.completed})
            </button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="stats-section">
          <button className="stats-toggle" onClick={() => setShowStats(!showStats)}>
            📊 الإحصائيات {showStats ? '▼' : '▶'}
          </button>
          {showStats && (
            <div className="stats-grid">
              <div className="stat-card total">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">إجمالي</span>
              </div>
              <div className="stat-card active">
                <span className="stat-number">{stats.active}</span>
                <span className="stat-label">قيد الإنجاز</span>
              </div>
              <div className="stat-card completed">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">مكتملة</span>
              </div>
              <div className="stat-card overdue">
                <span className="stat-number">{stats.overdue}</span>
                <span className="stat-label">متأخرة</span>
              </div>
            </div>
          )}
        </div>

        {/* نموذج إضافة مهمة */}
        <form onSubmit={addTodo} className="add-todo-form">
          <div className="form-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="أضف مهمة جديدة..."
              className="todo-input"
            />
            <button type="submit" className="add-btn">
              ➕ إضافة
            </button>
          </div>

          <div className="form-controls">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-input"
            >
              <option>عام</option>
              <option>عمل</option>
              <option>شخصي</option>
              <option>صحة</option>
              <option>تعليم</option>
              <option>تسوق</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="select-input"
            >
              <option value="low">🟢 منخفضة</option>
              <option value="medium">🟡 متوسطة</option>
              <option value="high">🔴 عالية</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
          </div>
        </form>

        {/* قائمة المهام */}
        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>لا توجد مهام هنا</p>
              <button onClick={loadSampleTodos} className="sample-btn">
                📥 تحميل نموذج
              </button>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="checkbox"
                  />
                </div>

                <div className="todo-content">
                  {editingId === todo.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="edit-input"
                      />
                      <button onClick={() => updateTodo(todo.id)} className="save-btn">
                        💾 حفظ
                      </button>
                      <button onClick={() => setEditingId(null)} className="cancel-btn">
                        ❌ إلغاء
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="todo-text-container">
                        <span className="todo-text">{todo.text}</span>
                        <div className="todo-meta">
                          <span className={`priority-badge ${todo.priority}`}>
                            {todo.priority === 'high' && '🔴'}
                            {todo.priority === 'medium' && '🟡'}
                            {todo.priority === 'low' && '🟢'}
                            {' '}{todo.priority}
                          </span>
                          <span className="category-badge">{todo.category}</span>
                          {todo.dueDate && (
                            <span className={`date-badge ${new Date(todo.dueDate) < new Date() && !todo.completed ? 'overdue' : ''}`}>
                              📅 {new Date(todo.dueDate).toLocaleDateString('ar-SA')}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="todo-actions">
                  {editingId !== todo.id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditingText(todo.text);
                        }}
                        className="edit-btn"
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-btn"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* أزرار إضافية */}
        <div className="action-buttons">
          <button
            onClick={() => setTodos(todos.filter(t => !t.completed))}
            className="clear-btn"
            disabled={stats.completed === 0}
          >
            🧹 حذف المكتملة ({stats.completed})
          </button>
          <button
            onClick={() => setTodos([])}
            className="reset-btn"
            disabled={todos.length === 0}
          >
            🔄 حذف الكل
          </button>
          <button
            onClick={loadSampleTodos}
            className="sample-btn"
          >
            📥 تحميل نموذج
          </button>
        </div>
      </main>

      <footer className="todo-footer">
        <p>✨ تطبيق قائمة المهام | جميع البيانات محفوظة محلياً في جهازك</p>
      </footer>
    </div>
  );
}

export default TodoApp;
