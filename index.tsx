import React, { useState, useEffect, useRef } from 'react';
import { Shield, Moon, Sun, Play, Pause, Plus, Trash2, Eye, Download, Upload, Database, AlertTriangle, Clock, CheckCircle, Star, Ticket, Users, FileText, TrendingUp, Book, Settings } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const FraudDetectionSystem = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [simulationActive, setSimulationActive] = useState(true);
  const [projectDay, setProjectDay] = useState(1);
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeSubTab, setActiveSubTab] = useState({
    itil: 'incidentes',
    pmbok: 'riesgos'
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showRiskDetail, setShowRiskDetail] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [toasts, setToasts] = useState([]);
  
  const [allData, setAllData] = useState({
    incidentes: [],
    problemas: [],
    cambios: [],
    riesgos: [],
    hitos: [],
    lecciones: [],
    conocimientos: []
  });

  const simulationIntervalRef = useRef(null);
  const dayIntervalRef = useRef(null);
  const dateIntervalRef = useRef(null);

  // Datos de ejemplo
  const sampleIncidents = [
    "Caída del servicio de predicción de fraude en producción",
    "Falsos positivos elevados (15%) en transacciones internacionales",
    "Tiempo de respuesta del modelo > 3 segundos (SLA: 1s)",
    "Error en la integración con API del core bancario",
    "Alertas duplicadas enviadas a clientes legítimos",
    "Degradación del rendimiento en horario pico",
    "Fallo en el servicio de autenticación biométrica",
    "Inconsistencia en datos entre staging y producción"
  ];

  const sampleProblems = [
    "Degradación progresiva del modelo por data drift",
    "Sesgo algorítmico detectado en transacciones de bajo monto",
    "Falta de datos etiquetados para reentrenamiento",
    "Inconsistencia en features entre entrenamiento y producción",
    "Memoria insuficiente en servidores de inferencia",
    "Latencia elevada en consultas a base de datos histórica",
    "Configuración incorrecta del balanceador de carga"
  ];

  const sampleChanges = [
    "Actualización del modelo de Random Forest v2.3 a v2.4",
    "Implementación de nuevo threshold de scoring (0.7 a 0.65)",
    "Migración de base de datos PostgreSQL 12 a 14",
    "Despliegue de dashboard de monitoreo en tiempo real",
    "Actualización de bibliotecas de seguridad críticas",
    "Cambio en arquitectura de microservicios",
    "Implementación de cache distribuido Redis"
  ];

  const sampleRisks = [
    "Regulación bancaria podría exigir explicabilidad total del modelo",
    "Fuga de talento clave (Data Scientists) a competidores",
    "Ciberataque tipo adversarial attack al modelo de ML",
    "Incompatibilidad con sistemas legacy del banco",
    "Sobrecostos por uso de infraestructura cloud",
    "Retrasos en certificaciones de seguridad requeridas",
    "Resistencia al cambio por parte de usuarios finales"
  ];

  const sampleMilestones = [
    "Aprobación del comité ejecutivo para inicio del proyecto",
    "Finalización de la fase de entrenamiento del modelo",
    "Certificación PCI DSS del ambiente productivo",
    "Go-live en producción con 10% del tráfico",
    "Completar integración con sistema core bancario",
    "Aprobación de auditoría de seguridad externa",
    "Capacitación completa de usuarios finales",
    "Documentación técnica y operativa finalizada"
  ];

  const sampleLessons = [
    "Validar calidad de datos ANTES de entrenar modelos",
    "Incluir al área legal desde la fase de diseño",
    "Realizar pruebas de carga con 3x el tráfico esperado",
    "Documentar todas las decisiones del CAB",
    "Establecer métricas de negocio claras desde el inicio",
    "Involucrar a usuarios finales en pruebas tempranas",
    "Mantener ambiente de staging idéntico a producción",
    "Implementar rollback automático ante fallos críticos"
  ];

  const sampleKnowledge = [
    {
      title: "Cómo interpretar métricas de un modelo de fraude",
      content: "Precision, Recall, F1-Score y AUC-ROC son métricas clave. En detección de fraudes, preferimos Recall alto para no perder fraudes reales, aunque esto genere más falsos positivos.",
      category: "Machine Learning"
    },
    {
      title: "Proceso de gestión de incidentes en servicios de IA",
      content: "1) Detección automática vía monitoring, 2) Clasificación por severidad, 3) Escalamiento al equipo ML, 4) Análisis de impacto, 5) Resolución y cierre con documentación.",
      category: "ITIL 4"
    },
    {
      title: "Mitigación de sesgo algorítmico",
      content: "Aplicar técnicas de fairness (reweighting, threshold optimization), auditar con datasets diversos, implementar monitoring continuo de métricas de equidad.",
      category: "IA Ética"
    }
  ];

  const responsables = [
    "Juan Pérez - Data Scientist",
    "María García - DevOps Engineer",
    "Carlos López - ML Engineer",
    "Ana Martínez - QA Analyst",
    "Pedro Sánchez - Gestor de Cambios",
    "Laura Torres - Analista de Riesgos",
    "Miguel Ángel - Arquitecto de Soluciones",
    "Sofia Ramírez - Product Owner"
  ];

  const pmbokAreas = [
    "Alcance", "Cronograma", "Costos", "Calidad", "Recursos",
    "Comunicaciones", "Riesgos", "Adquisiciones", "Interesados",
    "Integración", "Métricas", "Adaptabilidad"
  ];

  // Funciones auxiliares
  const generateId = (prefix) => {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const createRandomRecord = (type) => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    
    switch(type) {
      case 'incidente':
        return {
          id: generateId('INC'),
          fecha: formatDate(date),
          descripcion: sampleIncidents[Math.floor(Math.random() * sampleIncidents.length)],
          severidad: ['Crítica', 'Alta', 'Media', 'Baja'][Math.floor(Math.random() * 4)],
          responsable: responsables[Math.floor(Math.random() * responsables.length)],
          estado: ['Abierto', 'En Progreso', 'Resuelto'][Math.floor(Math.random() * 3)]
        };
      
      case 'problema':
        return {
          id: generateId('PRB'),
          fecha: formatDate(date),
          descripcion: sampleProblems[Math.floor(Math.random() * sampleProblems.length)],
          causaRaiz: 'Análisis en progreso mediante técnica 5 Whys y diagrama de Ishikawa',
          responsable: responsables[Math.floor(Math.random() * responsables.length)],
          estado: ['Abierto', 'En Análisis', 'Resuelto'][Math.floor(Math.random() * 3)]
        };
      
      case 'cambio':
        return {
          id: generateId('CHG'),
          fecha: formatDate(date),
          descripcion: sampleChanges[Math.floor(Math.random() * sampleChanges.length)],
          tipo: ['Normal', 'Estándar', 'Emergencia'][Math.floor(Math.random() * 3)],
          impacto: ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)],
          estado: ['Pendiente', 'Aprobado', 'Rechazado', 'Implementado'][Math.floor(Math.random() * 4)]
        };
      
      case 'riesgo':
        const prob = ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)];
        const imp = ['Alto', 'Medio', 'Bajo'][Math.floor(Math.random() * 3)];
        return {
          id: generateId('RSK'),
          fecha: formatDate(date),
          descripcion: sampleRisks[Math.floor(Math.random() * sampleRisks.length)],
          probabilidad: prob,
          impacto: imp,
          mitigacion: 'Plan de mitigación definido y en seguimiento continuo',
          responsableRiesgo: responsables[Math.floor(Math.random() * responsables.length)],
          categoria: ['Técnico', 'Financiero', 'Operacional', 'Legal'][Math.floor(Math.random() * 4)],
          estado: ['Activo', 'Mitigado', 'Cerrado'][Math.floor(Math.random() * 3)]
        };
      
      case 'hito':
        return {
          id: generateId('MLT'),
          fechaPlanificada: formatDate(date),
          descripcion: sampleMilestones[Math.floor(Math.random() * sampleMilestones.length)],
          entregable: 'Documento técnico, presentación ejecutiva y aprobación formal',
          responsable: responsables[Math.floor(Math.random() * responsables.length)],
          estado: ['Pendiente', 'En Progreso', 'Completado'][Math.floor(Math.random() * 3)],
          progreso: Math.floor(Math.random() * 100)
        };
      
      case 'leccion':
        return {
          id: generateId('LCN'),
          fecha: formatDate(date),
          situacion: 'Experiencia durante fase de ' + ['desarrollo', 'testing', 'despliegue', 'operación'][Math.floor(Math.random() * 4)],
          leccion: sampleLessons[Math.floor(Math.random() * sampleLessons.length)],
          categoria: pmbokAreas[Math.floor(Math.random() * pmbokAreas.length)],
          impacto: ['Positivo', 'Negativo', 'Neutral'][Math.floor(Math.random() * 3)],
          aplicabilidad: ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)]
        };
      
      case 'conocimiento':
        const kb = sampleKnowledge[Math.floor(Math.random() * sampleKnowledge.length)];
        return {
          id: generateId('KB'),
          fecha: formatDate(date),
          titulo: kb.title,
          contenido: kb.content,
          categoria: kb.category,
          autor: responsables[Math.floor(Math.random() * responsables.length)]
        };
      
      default:
        return null;
    }
  };

  const generateRandomRecord = () => {
    const types = ['incidente', 'problema', 'cambio', 'riesgo', 'hito', 'leccion', 'conocimiento'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const record = createRandomRecord(randomType);
    
    if (record) {
      setAllData(prev => {
        const key = randomType + 's';
        const currentArray = prev[key] || [];
        return {
          ...prev,
          [key]: [...currentArray, record]
        };
      });
      showToast(`Nuevo ${randomType} generado automáticamente`, 'success');
    }
  };

  const deleteRecord = (type, id) => {
    const key = type + 's';
    setAllData(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.id !== id)
    }));
    showToast('Registro eliminado', 'warning');
  };

  const loadSampleData = () => {
    if (!window.confirm('¿Desea cargar los datos de ejemplo? Esto agregará 20 registros nuevos.')) {
      return;
    }
    
    const newData = { ...allData };
    for (let i = 0; i < 20; i++) {
      const types = ['incidente', 'problema', 'cambio', 'riesgo', 'hito', 'leccion'];
      const type = types[i % types.length];
      const record = createRandomRecord(type);
      if (record) {
        newData[type + 's'].push(record);
      }
    }
    setAllData(newData);
    showToast('20 registros de ejemplo cargados exitosamente', 'success');
  };

  const clearAllData = () => {
    if (!window.confirm('¿Está seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setAllData({
      incidentes: [],
      problemas: [],
      cambios: [],
      riesgos: [],
      hitos: [],
      lecciones: [],
      conocimientos: []
    });
    setProjectDay(1);
    showToast('Todos los datos han sido eliminados', 'warning');
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-detection-data-${Date.now()}.json`;
    a.click();
    showToast('Datos exportados exitosamente', 'success');
  };

  const calculateRiskSeverity = (prob, impact) => {
    const probValue = prob === 'Alta' ? 3 : prob === 'Media' ? 2 : 1;
    const impactValue = impact === 'Alto' ? 3 : impact === 'Medio' ? 2 : 1;
    const total = probValue * impactValue;
    
    if (total >= 6) return { label: 'Severidad Crítica', class: 'high' };
    if (total >= 3) return { label: 'Severidad Media', class: 'medium' };
    return { label: 'Severidad Baja', class: 'low' };
  };

  // Effects
  useEffect(() => {
    if (simulationActive) {
      simulationIntervalRef.current = setInterval(() => {
        generateRandomRecord();
      }, 5000);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [simulationActive, allData]);

  useEffect(() => {
    dayIntervalRef.current = setInterval(() => {
      setProjectDay(prev => prev + 1);
    }, 10000);

    return () => {
      if (dayIntervalRef.current) {
        clearInterval(dayIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    dateIntervalRef.current = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      if (dateIntervalRef.current) {
        clearInterval(dateIntervalRef.current);
      }
    };
  }, []);

  // Cálculo de métricas
  const metrics = {
    avgResolutionTime: allData.incidentes.length > 0 ? `${(2 + Math.random() * 2).toFixed(1)} horas` : '0 horas',
    firstContactResolution: allData.incidentes.length > 0 ? `${Math.floor(70 + Math.random() * 20)}%` : '0%',
    userSatisfaction: allData.incidentes.length > 0 ? `${(4.2 + Math.random() * 0.8).toFixed(1)}/5.0` : '0/5.0',
    activeIncidents: allData.incidentes.filter(i => i.estado !== 'Resuelto').length
  };

  const projectProgress = allData.hitos.length > 0 
    ? Math.floor((allData.hitos.filter(h => h.estado === 'Completado').length / allData.hitos.length) * 100)
    : 0;

  // Datos para gráficos
  const incidentsSeverityData = [
    { name: 'Crítica', value: allData.incidentes.filter(i => i.severidad === 'Crítica').length },
    { name: 'Alta', value: allData.incidentes.filter(i => i.severidad === 'Alta').length },
    { name: 'Media', value: allData.incidentes.filter(i => i.severidad === 'Media').length },
    { name: 'Baja', value: allData.incidentes.filter(i => i.severidad === 'Baja').length }
  ];

  const changesStatusData = [
    { name: 'Pendiente', value: allData.cambios.filter(c => c.estado === 'Pendiente').length },
    { name: 'Aprobado', value: allData.cambios.filter(c => c.estado === 'Aprobado').length },
    { name: 'Rechazado', value: allData.cambios.filter(c => c.estado === 'Rechazado').length },
    { name: 'Implementado', value: allData.cambios.filter(c => c.estado === 'Implementado').length }
  ];

  const COLORS = ['#dc3545', '#ff6384', '#ffc107', '#17a2b8'];
  const PIE_COLORS = ['#ffc107', '#0055ff', '#dc3545', '#28a745'];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gradient-to-r from-blue-900 to-blue-600'} text-white p-4 shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <h1 className="text-xl font-bold">Sistema de Detección de Fraudes con IA</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Día del proyecto: <strong>{projectDay}</strong>
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {currentDateTime.toLocaleString('es-ES')}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Simulation Control */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex justify-center items-center gap-6 border-b-4 border-blue-500`}>
        <button
          onClick={() => setSimulationActive(!simulationActive)}
          className={`${simulationActive ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition shadow-lg`}
        >
          {simulationActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {simulationActive ? 'Pausar Simulación' : 'Reanudar Simulación'}
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-3 h-3 rounded-full ${simulationActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {simulationActive ? 'Simulación activa - Nuevo registro cada 5 segundos' : 'Simulación pausada'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-2 flex gap-2 overflow-x-auto`}>
        {[
          { id: 'inicio', label: 'Inicio', icon: Shield },
          { id: 'itil', label: 'Gestión ITIL', icon: Settings },
          { id: 'pmbok', label: 'Gestión PMBOK', icon: FileText },
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'conocimiento', label: 'Base de Conocimientos', icon: Book },
          { id: 'reportes', label: 'Reportes', icon: Download }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Inicio Tab */}
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              Proyecto de Implementación de Sistema de Detección de Fraudes con IA
            </h2>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className="text-xl font-bold text-blue-600 mb-4">Contexto del Proyecto</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Banco Nacional S.A. ha iniciado un proyecto estratégico para implementar un sistema de detección de fraudes utilizando Machine Learning e Inteligencia Artificial. El objetivo es reducir las pérdidas por transacciones fraudulentas en un 85% durante el primer año de operación.
              </p>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Este proyecto integra las mejores prácticas de <strong>ITIL 4</strong> para la gestión de servicios TI y el marco <strong>PMBOK 7ma edición</strong> para la dirección de proyectos, asegurando una implementación exitosa y sostenible.
              </p>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
              <h3 className="text-xl font-bold text-blue-600 mb-4">Progreso General del Proyecto</h3>
              <div className="relative w-full h-10 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center transition-all duration-500"
                  style={{ width: `${projectProgress}%` }}
                >
                  <span className="text-white font-bold text-sm">{projectProgress}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Ticket, label: 'Gestión de Incidentes', desc: 'Monitoreo 24/7 de alertas del modelo' },
                { icon: Settings, label: 'Gestión de Problemas', desc: 'Análisis de causa raíz de degradación' },
                { icon: FileText, label: 'Gestión de Cambios', desc: 'CAB para actualizaciones del modelo' },
                { icon: AlertTriangle, label: 'Gestión de Riesgos', desc: 'Identificación y mitigación de riesgos' }
              ].map((item, idx) => (
                <div key={idx} className={`${darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-700' : 'bg-gradient-to-br from-blue-600 to-blue-500'} text-white rounded-xl p-6 shadow-lg hover:scale-105 transition`}>
                  <item.icon className="w-12 h-12 mb-4" />
                  <h4 className="font-bold mb-2">{item.label}</h4>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITIL Tab */}
        {activeTab === 'itil' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b-2 border-gray-300 pb-2">
              {['incidentes', 'problemas', 'cambios', 'servicedesk'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(prev => ({ ...prev, itil: tab }))}
                  className={`px-4 py-2 font-medium transition border-b-4 ${
                    activeSubTab.itil === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeSubTab.itil === 'incidentes' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-blue-600" />
                    Gestión de Incidentes ITIL 4
                  </h2>
                </div>
                <input
                  type="text"
                  placeholder="Buscar incidentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full max-w-md px-4 py-2 rounded-lg border-2 mb-4 ${
                    darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Fecha</th>
                          <th className="px-4 py-3 text-left">Descripción</th>
                          <th className="px-4 py-3 text-left">Severidad</th>
                          <th className="px-4 py-3 text-left">Responsable</th>
                          <th className="px-4 py-3 text-left">Estado</th>
                          <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allData.incidentes
                          .filter(inc => 
                            Object.values(inc).some(val => 
                              String(val).toLowerCase().includes(searchTerm.toLowerCase())
                            )
                          )
                          .map(inc => (
                          <tr key={inc.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <td className="px-4 py-3 text-sm">{inc.id}</td>
                            <td className="px-4 py-3 text-sm">{inc.fecha}</td>
                            <td className="px-4 py-3 text-sm">{inc.descripcion}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                inc.severidad === 'Crítica' ? 'bg-red-100 text-red-800' :
                                inc.severidad === 'Alta' ? 'bg-orange-100 text-orange-800' :
                                inc.severidad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {inc.severidad}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{inc.responsable}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                inc.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                                inc.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {inc.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => deleteRecord('incidente', inc.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab.itil === 'problemas' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-blue-600" />
                  Gestión de Problemas ITIL 4
                </h2>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Descripción</th>
                        <th className="px-4 py-3 text-left">Causa Raíz</th>
                        <th className="px-4 py-3 text-left">Responsable</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.problemas.map(prob => (
                        <tr key={prob.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm">{prob.id}</td>
                          <td className="px-4 py-3 text-sm">{prob.fecha}</td>
                          <td className="px-4 py-3 text-sm">{prob.descripcion}</td>
                          <td className="px-4 py-3 text-sm">{prob.causaRaiz}</td>
                          <td className="px-4 py-3 text-sm">{prob.responsable}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              prob.estado === 'Resuelto' ? 'bg-green-100 text-green-800' :
                              prob.estado === 'En Análisis' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {prob.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteRecord('problema', prob.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubTab.itil === 'cambios' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Gestión de Cambios (CAB)
                </h2>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Descripción</th>
                        <th className="px-4 py-3 text-left">Tipo</th>
                        <th className="px-4 py-3 text-left">Impacto</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.cambios.map(cambio => (
                        <tr key={cambio.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm">{cambio.id}</td>
                          <td className="px-4 py-3 text-sm">{cambio.fecha}</td>
                          <td className="px-4 py-3 text-sm">{cambio.descripcion}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {cambio.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              cambio.impacto === 'Alto' ? 'bg-red-100 text-red-800' :
                              cambio.impacto === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {cambio.impacto}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              cambio.estado === 'Implementado' ? 'bg-green-100 text-green-800' :
                              cambio.estado === 'Aprobado' ? 'bg-blue-100 text-blue-800' :
                              cambio.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {cambio.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteRecord('cambio', cambio.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubTab.itil === 'servicedesk' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Service Desk - Métricas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Clock, label: 'Tiempo Promedio de Resolución', value: metrics.avgResolutionTime, color: 'blue' },
                    { icon: CheckCircle, label: 'Tasa de Resolución Primer Contacto', value: metrics.firstContactResolution, color: 'green' },
                    { icon: Star, label: 'Satisfacción del Usuario', value: metrics.userSatisfaction, color: 'yellow' },
                    { icon: Ticket, label: 'Incidentes Activos', value: metrics.activeIncidents, color: 'red' }
                  ].map((metric, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg text-center hover:scale-105 transition`}>
                      <metric.icon className={`w-12 h-12 mx-auto mb-4 text-${metric.color}-600`} />
                      <h3 className="text-sm text-gray-500 mb-2">{metric.label}</h3>
                      <p className="text-3xl font-bold text-blue-600">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PMBOK Tab */}
        {activeTab === 'pmbok' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b-2 border-gray-300 pb-2">
              {['riesgos', 'hitos', 'lecciones', 'interesados'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(prev => ({ ...prev, pmbok: tab }))}
                  className={`px-4 py-2 font-medium transition border-b-4 ${
                    activeSubTab.pmbok === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeSubTab.pmbok === 'riesgos' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                  Gestión de Riesgos PMBOK 7
                </h2>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Descripción</th>
                        <th className="px-4 py-3 text-left">Probabilidad</th>
                        <th className="px-4 py-3 text-left">Impacto</th>
                        <th className="px-4 py-3 text-left">Mitigación</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.riesgos.map(riesgo => (
                        <tr key={riesgo.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm">{riesgo.id}</td>
                          <td className="px-4 py-3 text-sm">{riesgo.fecha}</td>
                          <td className="px-4 py-3 text-sm">{riesgo.descripcion}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              riesgo.probabilidad === 'Alta' ? 'bg-red-100 text-red-800' :
                              riesgo.probabilidad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {riesgo.probabilidad}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              riesgo.impacto === 'Alto' ? 'bg-red-100 text-red-800' :
                              riesgo.impacto === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {riesgo.impacto}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{riesgo.mitigacion.substring(0, 40)}...</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedRisk(riesgo);
                                setShowRiskDetail(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecord('riesgo', riesgo.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubTab.pmbok === 'hitos' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Hitos del Proyecto
                </h2>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Fecha Planificada</th>
                        <th className="px-4 py-3 text-left">Descripción</th>
                        <th className="px-4 py-3 text-left">Entregable</th>
                        <th className="px-4 py-3 text-left">Responsable</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.hitos.map(hito => (
                        <tr key={hito.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm">{hito.id}</td>
                          <td className="px-4 py-3 text-sm">{hito.fechaPlanificada}</td>
                          <td className="px-4 py-3 text-sm">{hito.descripcion}</td>
                          <td className="px-4 py-3 text-sm">{hito.entregable}</td>
                          <td className="px-4 py-3 text-sm">{hito.responsable}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              hito.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                              hito.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {hito.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteRecord('hito', hito.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubTab.pmbok === 'lecciones' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Book className="w-6 h-6 text-blue-600" />
                  Lecciones Aprendidas
                </h2>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-left">Situación</th>
                        <th className="px-4 py-3 text-left">Lección</th>
                        <th className="px-4 py-3 text-left">Categoría</th>
                        <th className="px-4 py-3 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.lecciones.map(leccion => (
                        <tr key={leccion.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm">{leccion.id}</td>
                          <td className="px-4 py-3 text-sm">{leccion.fecha}</td>
                          <td className="px-4 py-3 text-sm">{leccion.situacion}</td>
                          <td className="px-4 py-3 text-sm">{leccion.leccion}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {leccion.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteRecord('leccion', leccion.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeSubTab.pmbok === 'interesados' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Gestión de Interesados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { role: 'Sponsor Ejecutivo', name: 'Gerente General', interest: 'Alto', power: 'Alto', status: 'Comprometido', color: 'green' },
                    { role: 'Director de TI', name: 'CIO', interest: 'Alto', power: 'Alto', status: 'Comprometido', color: 'green' },
                    { role: 'Equipo de Desarrollo', name: '15 profesionales', interest: 'Alto', power: 'Medio', status: 'Participativo', color: 'blue' },
                    { role: 'Área de Cumplimiento', name: 'Compliance Officer', interest: 'Alto', power: 'Alto', status: 'Neutral', color: 'yellow' },
                    { role: 'Área de Seguridad', name: 'CISO', interest: 'Alto', power: 'Alto', status: 'Comprometido', color: 'green' },
                    { role: 'Usuarios Finales', name: 'Analistas de Fraude', interest: 'Alto', power: 'Bajo', status: 'Participativo', color: 'blue' }
                  ].map((stakeholder, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg text-center hover:scale-105 transition`}>
                      <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="font-bold text-lg mb-2">{stakeholder.role}</h3>
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}><strong>{stakeholder.name}</strong></p>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interés: {stakeholder.interest} | Poder: {stakeholder.power}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${stakeholder.color}-100 text-${stakeholder.color}-800`}>
                        {stakeholder.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Dashboard de Indicadores
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className="text-lg font-bold mb-4">Incidentes por Severidad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incidentsSeverityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {incidentsSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                <h3 className="text-lg font-bold mb-4">Estado de Cambios</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={changesStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {changesStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Base de Conocimientos Tab */}
        {activeTab === 'conocimiento' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Book className="w-6 h-6 text-blue-600" />
              Base de Conocimientos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allData.conocimientos.map(kb => (
                <div key={kb.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:scale-105 transition`}>
                  <h3 className="font-bold text-lg mb-3">{kb.titulo}</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{kb.contenido}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{kb.categoria}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{kb.autor}</span>
                  </div>
                  <button
                    onClick={() => deleteRecord('conocimiento', kb.id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reportes Tab */}
        {activeTab === 'reportes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-600" />
              Exportar Reportes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg text-center hover:scale-105 transition`}>
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-lg mb-3">Exportar Datos Completos (JSON)</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Descarga todos los datos del proyecto en formato JSON para respaldo o análisis externo
                </p>
                <button
                  onClick={exportJSON}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
                >
                  <Download className="w-5 h-5" />
                  Descargar JSON
                </button>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg text-center hover:scale-105 transition`}>
                <Database className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="font-bold text-lg mb-3">Cargar Datos de Ejemplo</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Carga 20 registros iniciales realistas para comenzar la simulación
                </p>
                <button
                  onClick={loadSampleData}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
                >
                  <Play className="w-5 h-5" />
                  Cargar Datos
                </button>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg text-center hover:scale-105 transition`}>
                <Trash2 className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h3 className="font-bold text-lg mb-3">Limpiar Todos los Datos</h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Elimina todos los registros y reinicia el proyecto (acción irreversible)
                </p>
                <button
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Limpiar Todo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Detalle de Riesgo */}
      {showRiskDetail && selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowRiskDetail(false)}>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                Detalle del Riesgo
              </h2>
              <button
                onClick={() => setShowRiskDetail(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">ID del Riesgo</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedRisk.id}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Fecha de Identificación</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedRisk.fecha}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Descripción Completa</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedRisk.descripcion}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Nivel de Severidad</h4>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                  calculateRiskSeverity(selectedRisk.probabilidad, selectedRisk.impacto).class === 'high' 
                    ? 'bg-red-100 text-red-800'
                    : calculateRiskSeverity(selectedRisk.probabilidad, selectedRisk.impacto).class === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                  {calculateRiskSeverity(selectedRisk.probabilidad, selectedRisk.impacto).label}
                </span>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Probabilidad de Ocurrencia</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedRisk.probabilidad === 'Alta' ? 'bg-red-100 text-red-800' :
                  selectedRisk.probabilidad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedRisk.probabilidad}
                </span>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Impacto en el Proyecto</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedRisk.impacto === 'Alto' ? 'bg-red-100 text-red-800' :
                  selectedRisk.impacto === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedRisk.impacto}
                </span>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Plan de Mitigación</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedRisk.mitigacion}</p>
              </div>

              {selectedRisk.responsableRiesgo && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Responsable</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedRisk.responsableRiesgo}</p>
                </div>
              )}

              {selectedRisk.categoria && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Categoría</h4>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {selectedRisk.categoria}
                  </span>
                </div>
              )}

              {selectedRisk.estado && (
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2 uppercase text-sm">Estado Actual</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedRisk.estado === 'Mitigado' || selectedRisk.estado === 'Cerrado' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedRisk.estado}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-6 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-2xl p-4 min-w-[280px] flex items-center gap-3 border-l-4 ${
              toast.type === 'success' ? 'border-green-500' :
              toast.type === 'warning' ? 'border-yellow-500' :
              toast.type === 'error' ? 'border-red-500' :
              'border-blue-500'
            } animate-slide-in`}
          >
            {toast.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
            {toast.type === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
            {toast.type === 'error' && <AlertTriangle className="w-6 h-6 text-red-500" />}
            {toast.type === 'info' && <Shield className="w-6 h-6 text-blue-500" />}
            <span className={`flex-1 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{toast.message}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FraudDetectionSystem;
