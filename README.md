# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Optimizaciones de Rendimiento de Imágenes

Se implementaron varias estrategias de optimización para mejorar el LCP (Largest Contentful Paint) y la experiencia de usuario general, enfocándose en las imágenes del encabezado y del pie de página.

### Imagen del Encabezado (Elemento LCP)

Para la imagen principal del encabezado, que es el elemento LCP más importante, se aplicaron las siguientes técnicas:

- **Preload**: Se añadió `<link rel="preload">` en el `index.html` para indicarle al navegador que comience a descargar esta imagen con alta prioridad lo antes posible, sin esperar a que se analice el resto del DOM.
- **Fetch Priority**: Se utilizó el atributo `fetchPriority="high"` en la etiqueta `<img>` como una señal adicional para que el navegador priorice su descarga.
- **Async Decoding**: Se incluyó `decoding="async"` para permitir que el navegador decodifique la imagen fuera del hilo principal, reduciendo el bloqueo del renderizado.
- **Srcset y Sizes**: Aunque solo se dispone de una versión de la imagen, se añadieron los atributos `srcset` y `sizes` para informar al navegador sobre el tamaño real de la imagen y cómo se mostrará en el viewport. Esto le permite optimizar la asignación de recursos de manera más eficiente.

### Imagen del Pie de Página (Elemento Below-the-fold)

Para la imagen del pie de página, que no es visible al cargar la página, la estrategia fue diferente:

- **Lazy Loading**: Se implementó el atributo `loading="lazy"`, que le indica al navegador que difiera la descarga de esta imagen hasta que el usuario se desplace cerca de ella. Esto ahorra ancho de banda durante la carga inicial y acelera el renderizado del contenido visible.

### Resultados

A continuación se muestra una comparación del rendimiento antes y después de las optimizaciones.

**Antes:**

*Aquí va la imagen del antes*

**Después:**

*Aquí va la imagen del después*