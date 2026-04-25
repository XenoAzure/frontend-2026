# Cobalt Frontend - User Interface

Este es el cliente frontend para la aplicación Cobalt, una plataforma de mensajería industrial diseñada para equipos de trabajo.

## Tecnologías Utilizadas

- **React** (Biblioteca de UI)
- **Vite** (Herramienta de construcción)
- **React Router Dom** (Navegación)
- **Context API** (Gestión de estado global)
- **Vanilla CSS** (Estilos personalizados con estética industrial/glassmorphism)
- **Socket.io-client** (Comunicación en tiempo real)

## Configuración del Entorno

Para que el frontend pueda comunicarse con el backend, crea un archivo `.env` en la raíz del directorio `/frontend`:

```env
VITE_API_URL=http://localhost:8080
```

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible usualmente en `http://localhost:5173`.

## Características Principales

- **Diseño Industrial**: Estética basada en bordes afilados, fuentes tecnológicas (Orbitron) y efectos de glassmorphism.
- **Real-time Messaging**: Chat instantáneo en canales y mensajes directos.
- **Gestión de Workspaces**: Creación, edición y administración de espacios de trabajo.
- **Sistema de Tareas**: Seguimiento de objetivos dentro de cada workspace.
- **Perfil de Usuario**: Personalización de bio, imagen y gestión de amistades.
