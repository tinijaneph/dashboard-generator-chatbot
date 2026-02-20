import React, { useState } from 'react';
import { Send, Plus, Trash2, BarChart3, PieChart, TrendingUp, Users, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#567c8d', '#c8d9e5', '#2f4156', '#8b9db3', '#6b7d93', '#4a90a4', '#7fa8b8', '#3d5a6c'];

const DashboardAgent = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [presentMode, setPresentMode] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const API_URL = 'https://dashboard-agent-mbhsrssbzq-uc.a.run.app';

  const suggestions = [
    { icon: <TrendingUp className="w-8 h-8" />, text: "Employee Attrition Dashboard", prompt: "Create a comprehensive employee attrition analysis dashboard" },
    { icon: <Users className="w-8 h-8" />, text: "Compensation Analysis", prompt: "Analyze compensation trends by department and job role" },
    { icon: <BarChart3 className="w-8 h-8" />, text: "Job Satisfaction Insights", prompt: "Show me job satisfaction analysis across different factors" },
    { icon: <PieChart className="w-8 h-8" />, text: "Overtime Impact Analysis", prompt: "Analyze the relationship between overtime and attrition" }
  ];

  const generateChartDataFromDashboard = (viz) => {
    // Generate sample data based on the visualization type and title
    
    // TABLE data
    if (viz.type === 'table') {
      if (viz.title.toLowerCase().includes('department')) {
        return [
          { Department: 'Sales', 'Total Employees': 446, 'Attrition Count': 92, 'Attrition Rate': '20.6%' },
          { Department: 'R&D', 'Total Employees': 961, 'Attrition Count': 133, 'Attrition Rate': '13.8%' },
          { Department: 'HR', 'Total Employees': 63, 'Attrition Count': 12, 'Attrition Rate': '19.0%' }
        ];
      }
      if (viz.title.toLowerCase().includes('satisfaction')) {
        return [
          { Department: 'Sales', AvgEnvironmentSatisfaction: 2.68, AvgJobSatisfaction: 2.75, AvgWorkLifeBalance: 2.82 },
          { Department: 'R&D', AvgEnvironmentSatisfaction: 2.74, AvgJobSatisfaction: 2.73, AvgWorkLifeBalance: 2.73 },
          { Department: 'HR', AvgEnvironmentSatisfaction: 2.68, AvgJobSatisfaction: 2.60, AvgWorkLifeBalance: 2.92 }
        ];
      }
      if (viz.title.toLowerCase().includes('role') || viz.title.toLowerCase().includes('job')) {
        return [
          { JobRole: 'Laboratory Technician', Attrition: 'Yes', Count: 62 },
          { JobRole: 'Sales Executive', Attrition: 'Yes', Count: 57 },
          { JobRole: 'Research Scientist', Attrition: 'Yes', Count: 47 },
          { JobRole: 'Sales Representative', Attrition: 'Yes', Count: 33 },
          { JobRole: 'Human Resources', Attrition: 'Yes', Count: 12 }
        ];
      }
    }
    
    if (viz.type === 'bar' || viz.type === 'line') {
      if (viz.title.toLowerCase().includes('department')) {
        return [
          { name: 'Sales', value: 20.6 },
          { name: 'R&D', value: 13.8 },
          { name: 'HR', value: 19.0 }
        ];
      }
      if (viz.title.toLowerCase().includes('age')) {
        return Array.from({ length: 10 }, (_, i) => ({
          name: `${20 + i * 5}-${25 + i * 5}`,
          value: 3000 + i * 1000 + Math.random() * 500
        }));
      }
      if (viz.title.toLowerCase().includes('role') || viz.title.toLowerCase().includes('job')) {
        return [
          { name: 'Lab Technician', value: 62 },
          { name: 'Sales Executive', value: 57 },
          { name: 'Research Scientist', value: 47 },
          { name: 'Sales Rep', value: 33 },
          { name: 'HR', value: 12 }
        ];
      }
      if (viz.title.toLowerCase().includes('overtime')) {
        return [
          { name: 'Overtime', value: 127 },
          { name: 'No Overtime', value: 110 }
        ];
      }
      return [
        { name: 'Category A', value: 30 },
        { name: 'Category B', value: 25 },
        { name: 'Category C', value: 20 },
        { name: 'Category D', value: 15 },
        { name: 'Category E', value: 10 }
      ];
    }
    
    if (viz.type === 'pie' || viz.type === 'donut') {
      if (viz.title.toLowerCase().includes('attrition') && viz.title.toLowerCase().includes('distribution')) {
        return [
          { name: 'No', value: 1233 },
          { name: 'Yes', value: 237 }
        ];
      }
      if (viz.title.toLowerCase().includes('overtime')) {
        return [
          { name: 'Overtime - Yes', value: 127 },
          { name: 'Overtime - No', value: 110 },
          { name: 'No Overtime - Yes', value: 944 },
          { name: 'No Overtime - No', value: 289 }
        ];
      }
      return [
        { name: 'Segment A', value: 40 },
        { name: 'Segment B', value: 35 },
        { name: 'Segment C', value: 25 }
      ];
    }
    
    return [];
  };

  const createNewChat = (prompt = null) => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
      dashboard: null
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
    setShowLanding(false);
    
    if (prompt) {
      setTimeout(() => handleSendMessage(prompt), 100);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    let currentChatId = activeChat;
    if (!currentChatId) {
      const newChat = {
        id: Date.now(),
        title: `Chat ${chats.length + 1}`,
        messages: [],
        dashboard: null
      };
      setChats([...chats, newChat]);
      currentChatId = newChat.id;
      setActiveChat(currentChatId);
    }

    const userMessage = { role: 'user', content: message };
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setInput('');
    setLoading(true);
    setShowLanding(false);

    // Show generation progress
    setGenerationStatus('Analyzing your request...');

    try {
      const currentChat = chats.find(c => c.id === currentChatId);
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: currentChat?.messages || [],
          current_dashboard: currentChat?.dashboard || null
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Simulate generation progress
      if (data.dashboard) {
        setGenerationStatus('Generating overview...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setGenerationStatus('Creating visualizations...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setGenerationStatus('Generating insights...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const assistantMessage = { role: 'assistant', content: data.response };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, assistantMessage],
                dashboard: data.dashboard || chat.dashboard,
                title: data.dashboard?.title || chat.title
              }
            : chat
        )
      );

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setLoading(false);
      setGenerationStatus('');
    }
  };

  const deleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
      setShowLanding(true);
    }
  };

  const activeChartData = chats.find(chat => chat.id === activeChat);

  return (
    <div className="flex h-screen" style={{ background: '#ffffff' }}>
      {/* Sidebar - Can be hidden */}
      {showSidebar && (
        <div className="w-64 flex flex-col" style={{ background: '#f8fafb', borderRight: '1px solid #e1e8ed' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e1e8ed' }}>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#2f4156' }}>HR Analytics</h1>
              <p className="text-sm" style={{ color: '#8b9db3' }}>Dashboard Agent</p>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Hide sidebar"
              style={{ color: '#6b7d93' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        
        <div className="p-4">
          <button
            onClick={() => createNewChat()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors"
            style={{ background: '#567c8d', color: '#ffffff' }}
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between group`}
              style={{
                background: activeChat === chat.id ? '#e1e8ed' : 'transparent',
                color: activeChat === chat.id ? '#2f4156' : '#6b7d93'
              }}
              onClick={() => {
                setActiveChat(chat.id);
                setShowLanding(false);
              }}
            >
              <span className="text-sm truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#8b9db3' }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Show Sidebar Button (when hidden) */}
        {!showSidebar && !showLanding && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-lg shadow-lg transition-colors"
              title="Show sidebar"
              style={{ 
                background: '#567c8d',
                color: '#ffffff'
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {showLanding ? (
          /* PRESERVED ORIGINAL LANDING PAGE */
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden" style={{ 
            background: 'radial-gradient(ellipse at top, #2f4156 0%, #1a2942 50%, #0f1419 100%)'
          }}>
            {/* Animated mesh gradient background */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.4,
              background: `
                radial-gradient(at 20% 30%, #567c8d 0px, transparent 50%),
                radial-gradient(at 80% 70%, #2f4156 0px, transparent 50%),
                radial-gradient(at 50% 50%, #5567c8 0px, transparent 50%)
              `,
              filter: 'blur(80px)',
              animation: 'meshMove 20s ease-in-out infinite'
            }}></div>

            <style>{`
              @keyframes meshMove {
                0%, 100% { transform: scale(1) translate(0, 0); }
                33% { transform: scale(1.1) translate(5%, -5%); }
                66% { transform: scale(0.9) translate(-5%, 5%); }
              }
            `}</style>

            <div className="max-w-4xl w-full relative z-10">
              <div className="text-center mb-12">
                <h1 style={{ 
                  fontSize: '4.5rem', 
                  fontWeight: '200', 
                  color: '#ffffff',
                  marginBottom: '1rem',
                  letterSpacing: '-1px',
                  lineHeight: '1.1'
                }}>
                  HR <strong style={{ 
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #c8d9e5 0%, #567c8d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Analytics Hub</strong>
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#8b9db3', fontWeight: '300', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                  Generate insightful dashboards from your employee data
                </p>
                <p style={{ fontSize: '0.95rem', color: '#6b7d93', fontWeight: '400' }}>
                  Select a suggestion or type your own query
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => createNewChat(suggestion.prompt)}
                    className="flex items-center gap-4 p-6 rounded-xl transition-all relative overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      minHeight: '120px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ color: '#c8d9e5', filter: 'drop-shadow(0 4px 20px rgba(86, 124, 141, 0.3))' }}>{suggestion.icon}</div>
                    <div className="text-left flex-1">
                      <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '6px', fontSize: '1.1rem' }}>{suggestion.text}</div>
                      <div style={{ fontSize: '0.85rem', color: '#8b9db3', lineHeight: '1.4' }}>{suggestion.prompt}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-xl p-6" style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)' 
              }}>
                <h3 style={{ color: '#c8d9e5', fontWeight: '600', marginBottom: '12px' }}>Available Data Fields:</h3>
                <div className="grid grid-cols-3 gap-3 text-sm" style={{ color: '#8b9db3' }}>
                  <div>• Employee Demographics</div>
                  <div>• Job Profiles & Titles</div>
                  <div>• Work Hours</div>
                  <div>• Location Data</div>
                  <div>• Employment Status</div>
                  <div>• Band & Classification</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CHAT + DASHBOARD VIEW (SIDE BY SIDE) */
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Panel - Left Side */}
            {showChat && !presentMode && (
              <div className="w-96 flex flex-col" style={{ borderRight: '1px solid #e1e8ed', background: '#ffffff' }}>
                {/* Chat Header with small toggle arrow */}
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e1e8ed' }}>
                  <h2 className="font-semibold" style={{ color: '#2f4156' }}>Chat</h2>
                  <button
                    onClick={() => setShowChat(false)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    title="Hide chat"
                    style={{ color: '#6b7d93' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeChartData?.messages.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-sm p-3 rounded-lg text-sm`}
                        style={{
                          background: msg.role === 'user' ? '#c8d9e5' : '#f8fafb',
                          color: msg.role === 'user' ? '#2f4156' : '#6b7d93',
                          border: msg.role === 'user' ? 'none' : '1px solid #e1e8ed'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="text-left mb-4">
                      <div className="inline-block p-3 rounded-lg" style={{ background: '#f8fafb', border: '1px solid #e1e8ed' }}>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#567c8d' }}></div>
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#567c8d', animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#567c8d', animationDelay: '0.4s' }}></div>
                          </div>
                          {generationStatus && (
                            <div className="text-xs" style={{ color: '#8b9db3' }}>
                              {generationStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4" style={{ borderTop: '1px solid #e1e8ed' }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage(input)}
                      placeholder="Ask about the dashboard..."
                      className="flex-1 px-3 py-2 rounded-lg focus:outline-none text-sm"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e1e8ed',
                        color: '#2f4156'
                      }}
                      disabled={loading}
                    />
                    <button
                      onClick={() => handleSendMessage(input)}
                      disabled={!input.trim() || loading}
                      className="px-4 py-2 rounded-lg transition-colors"
                      style={{
                        background: input.trim() && !loading ? '#567c8d' : '#e1e8ed',
                        color: '#ffffff',
                        cursor: input.trim() && !loading ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Panel - Right Side */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Dashboard Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e1e8ed' }}>
                <div className="flex items-center gap-2">
                  {!showSidebar && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Show sidebar"
                      style={{ color: '#6b7d93' }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {!showChat && !presentMode && (
                    <button
                      onClick={() => setShowChat(true)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Show chat"
                      style={{ color: '#6b7d93' }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  <h2 className="font-semibold" style={{ color: '#2f4156' }}>
                    {activeChartData?.dashboard?.title || 'Dashboard'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setPresentMode(!presentMode);
                    if (!presentMode) {
                      setShowChat(false);
                      setShowSidebar(false);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
                  style={{ 
                    background: presentMode ? '#567c8d' : '#f8fafb',
                    color: presentMode ? '#ffffff' : '#6b7d93',
                    border: '1px solid #e1e8ed'
                  }}
                >
                  {presentMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  <span>{presentMode ? 'Exit' : 'Present'}</span>
                </button>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 overflow-y-auto p-6" style={{ background: '#ffffff' }}>
                {activeChartData?.dashboard ? (
                  <div className="max-w-7xl mx-auto">
                    {/* Overview */}
                    {activeChartData.dashboard.overview && (
                      <div className="mb-8">
                        <p className="text-base leading-relaxed" style={{ color: '#6b7d93' }}>
                          {activeChartData.dashboard.overview}
                        </p>
                      </div>
                    )}

                    {/* Overall Insights */}
                    {activeChartData.dashboard.overall_insights && (
                      <div className="rounded-lg p-6 mb-8" style={{ background: '#f8fafb', border: '1px solid #e1e8ed' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2f4156' }}>Overall Insights</h3>
                        <ul className="space-y-2">
                          {activeChartData.dashboard.overall_insights.map((insight, idx) => (
                            <li key={idx} className="flex items-start" style={{ color: '#6b7d93' }}>
                              <span style={{ color: '#567c8d', marginRight: '8px', fontWeight: 'bold' }}>•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Metrics Cards - Consistent Width */}
                    {activeChartData.dashboard.metrics && (
                      <div className="grid gap-4 mb-8" style={{
                        gridTemplateColumns: `repeat(${activeChartData.dashboard.metrics.length}, 1fr)`
                      }}>
                        {activeChartData.dashboard.metrics.map((metric, idx) => (
                          <div key={idx} className="rounded-lg p-6" style={{ background: '#f8fafb', border: '1px solid #e1e8ed' }}>
                            <div className="text-sm mb-2" style={{ color: '#8b9db3' }}>{metric.label}</div>
                            <div className="text-3xl font-bold mb-2" style={{ color: '#2f4156' }}>
                              {metric.value || 'N/A'}
                            </div>
                            {metric.insight && (
                              <div className="text-sm mb-2" style={{ color: '#6b7d93' }}>{metric.insight}</div>
                            )}
                            {metric.benchmark && (
                              <div className="text-xs" style={{ color: '#8b9db3' }}>{metric.benchmark}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Visualizations */}
                    {activeChartData.dashboard.visualizations && (
                      <div className="space-y-8">
                        {activeChartData.dashboard.visualizations.map((viz, idx) => (
                          <div key={idx} className="rounded-lg p-6" style={{ background: '#f8fafb', border: '1px solid #e1e8ed' }}>
                            <h4 className="text-lg font-semibold mb-2" style={{ color: '#2f4156' }}>{viz.title}</h4>
                            <p className="text-sm mb-4" style={{ color: '#8b9db3' }}>{viz.description}</p>
                            
                            <ResponsiveContainer width="100%" height={300}>
                              {viz.type === 'bar' ? (
                                <BarChart data={generateChartDataFromDashboard(viz)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                                  <XAxis dataKey="name" stroke="#8b9db3" style={{ fontSize: '12px' }} />
                                  <YAxis stroke="#8b9db3" style={{ fontSize: '12px' }} />
                                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e1e8ed', borderRadius: '8px' }} />
                                  <Bar dataKey="value" fill="#567c8d" radius={[8, 8, 0, 0]}>
                                    {generateChartDataFromDashboard(viz).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              ) : viz.type === 'line' ? (
                                <LineChart data={generateChartDataFromDashboard(viz)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                                  <XAxis dataKey="name" stroke="#8b9db3" style={{ fontSize: '12px' }} />
                                  <YAxis stroke="#8b9db3" style={{ fontSize: '12px' }} />
                                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e1e8ed', borderRadius: '8px' }} />
                                  <Line type="monotone" dataKey="value" stroke="#567c8d" strokeWidth={3} dot={{ fill: '#567c8d', r: 4 }} />
                                </LineChart>
                              ) : (viz.type === 'pie' || viz.type === 'donut') ? (
                                <RechartsPie>
                                  <Pie
                                    data={generateChartDataFromDashboard(viz)}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    innerRadius={viz.type === 'donut' ? 60 : 0}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {generateChartDataFromDashboard(viz).map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e1e8ed', borderRadius: '8px' }} />
                                </RechartsPie>
                              ) : viz.type === 'table' ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr style={{ background: '#e1e8ed' }}>
                                        {viz.fields && viz.fields.map((field, i) => (
                                          <th key={i} className="p-3 text-left font-semibold" style={{ color: '#2f4156' }}>
                                            {field}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {generateChartDataFromDashboard(viz).map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #e1e8ed' }}>
                                          {Object.values(row).map((val, j) => (
                                            <td key={j} className="p-3" style={{ color: '#6b7d93' }}>
                                              {val}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : null}
                            </ResponsiveContainer>

                            {/* Key Insights for this visualization */}
                            {viz.key_insights && (
                              <div className="mt-4 rounded-lg p-4" style={{ background: '#ffffff', border: '1px solid #e1e8ed' }}>
                                <h5 className="text-sm font-semibold mb-2" style={{ color: '#2f4156' }}>Key Insights</h5>
                                <ul className="space-y-2">
                                  {viz.key_insights.map((insight, i) => (
                                    <li key={i} className="flex items-start text-sm" style={{ color: '#6b7d93' }}>
                                      <span style={{ color: '#567c8d', marginRight: '6px' }}>→</span>
                                      <span>{insight}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {activeChartData.dashboard.recommendations && (
                      <div className="rounded-lg p-6 mt-8" style={{ background: '#f8fafb', border: '1px solid #e1e8ed' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2f4156' }}>Recommendations</h3>
                        <ul className="space-y-2">
                          {activeChartData.dashboard.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start" style={{ color: '#6b7d93' }}>
                              <span style={{ color: '#567c8d', marginRight: '8px', fontWeight: 'bold' }}>✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center" style={{ color: '#8b9db3' }}>
                      <p>Start a conversation to generate a dashboard</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAgent;
