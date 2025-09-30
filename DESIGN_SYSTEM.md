# Flow Pilot Design System

## 🎨 **Core Design Principles**

### **Color Palette**
- **Primary Background**: `#171717` (neutral-900)
- **Secondary Background**: `#0a0a0a` (neutral-950)
- **Card Background**: `rgba(23, 23, 23, 0.7)` (neutral-900/70)
- **Text Primary**: `#f5f5f5` (neutral-100)
- **Text Secondary**: `#a3a3a3` (neutral-400)
- **Text Muted**: `#737373` (neutral-500)
- **Borders**: `rgba(255, 255, 255, 0.1)` (white/10)
- **Rings**: `rgba(255, 255, 255, 0.05)` (white/5)

### **Accent Colors**
- **Success**: `#10b981` (emerald-400)
- **Info**: `#38bdf8` (sky-400)
- **Warning**: `#fbbf24` (amber-400)
- **Error**: `#f43f5e` (rose-500)
- **Purple**: `#a855f7` (purple-400)
- **Pink**: `#ec4899` (pink-400)
- **Teal**: `#14b8a6` (teal-400)
- **Blue**: `#3b82f6` (blue-400)

## 🏗️ **Layout System**

### **Container Structure**
```tsx
<div className="h-screen w-screen antialiased text-neutral-100 bg-neutral-900 overflow-hidden">
  <SplineBackground />
  <div className="flex flex-col lg:flex-row h-full">
    <SlimSidebar />
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 min-h-full">
        {/* Content */}
      </div>
    </main>
  </div>
</div>
```

### **Grid System**
- **Main Layout**: `grid-cols-1 xl:grid-cols-12`
- **Content Area**: `xl:col-span-8 2xl:col-span-9`
- **Sidebar**: `xl:col-span-4 2xl:col-span-3`
- **Project Cards**: `sm:grid-cols-2 lg:grid-cols-3`

## 🎯 **Component Patterns**

### **Cards**
```tsx
<div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-4 sm:p-6">
  {/* Card content */}
</div>
```

### **Buttons**
```tsx
// Primary Button
<button className="p-2 rounded-xl bg-neutral-900/70 ring-1 ring-white/10 hover:bg-neutral-800/70">
  <Icon className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
</button>

// Secondary Button
<button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200">
  Text
</button>
```

### **Progress Bars**
```tsx
<div className="h-2 rounded-full bg-neutral-800 ring-1 ring-white/5">
  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" 
       style={{ width: `${progress}%` }} />
</div>
```

### **Avatars**
```tsx
<div className="flex -space-x-2">
  <img className="h-6 w-6 rounded-full ring-2 ring-neutral-900 object-cover" 
       src={avatar} alt="avatar" />
</div>
```

## 📐 **Spacing System**

### **Padding**
- **Small**: `p-2` (8px)
- **Medium**: `p-4` (16px)
- **Large**: `p-6` (24px)
- **Extra Large**: `p-8` (32px)

### **Gaps**
- **Small**: `gap-2` (8px)
- **Medium**: `gap-4` (16px)
- **Large**: `gap-6` (24px)

### **Margins**
- **Small**: `mt-2` (8px)
- **Medium**: `mt-4` (16px)
- **Large**: `mt-6` (24px)

## 🎨 **Visual Effects**

### **Glassmorphism**
```css
background: rgba(23, 23, 23, 0.7);
backdrop-filter: blur(8px);
ring: 1px solid rgba(255, 255, 255, 0.1);
```

### **Gradients**
- **Primary**: `from-emerald-400 to-sky-400`
- **Task Bars**: Various color combinations for different task types
- **Progress**: `from-emerald-400 to-sky-400`

### **Shadows**
- **Cards**: `shadow-2xl`
- **Hover**: `hover:bg-neutral-800/70`

## 🔤 **Typography**

### **Font Family**
```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
```

### **Font Weights**
- **Light**: `font-light` (300)
- **Normal**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)

### **Text Sizes**
- **Large**: `text-2xl` (24px)
- **Medium**: `text-lg` (18px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)
- **Micro**: `text-[11px]` (11px)

## 🎯 **Interactive States**

### **Hover Effects**
```tsx
className="hover:bg-neutral-800/70 transition-colors"
```

### **Active States**
```tsx
className="bg-neutral-800/70 ring-1 ring-white/10"
```

### **Focus States**
```tsx
className="focus:ring-2 focus:ring-emerald-400/50"
```

## 📱 **Responsive Breakpoints**

- **Mobile**: `< 640px` - Stacked layout, hidden sidebar
- **Tablet**: `640px - 1024px` - Partial sidebar, adjusted spacing
- **Desktop**: `1024px - 1280px` - Full sidebar, standard layout
- **Large**: `1280px - 1536px` - Enhanced spacing
- **Extra Large**: `> 1536px` - Maximum spacing and sizing

## 🎨 **Icon System**

### **Icon Sizes**
- **Small**: `w-4 h-4` (16px)
- **Medium**: `w-5 h-5` (20px)
- **Large**: `w-6 h-6` (24px)

### **Icon Colors**
- **Primary**: `text-neutral-300`
- **Secondary**: `text-neutral-400`
- **Accent**: `text-emerald-400`

### **Stroke Width**
- **Standard**: `strokeWidth={1.5}`

## 🎯 **Component Guidelines**

### **Consistency Rules**
1. **Always use rounded corners**: `rounded-xl` or `rounded-2xl`
2. **Consistent spacing**: Use the spacing system
3. **Glassmorphism effects**: Apply to all cards and containers
4. **Hover states**: Include on all interactive elements
5. **Color consistency**: Use the defined color palette
6. **Typography hierarchy**: Follow the text size system

### **Accessibility**
- **Alt texts**: Required for all images
- **Semantic HTML**: Use proper HTML elements
- **Focus indicators**: Visible focus states
- **Color contrast**: Maintain sufficient contrast ratios

## 🚀 **Implementation Notes**

### **Performance**
- **Lazy loading**: For images and heavy components
- **Optimized imports**: Tree-shake unused code
- **Efficient rendering**: Use React.memo when appropriate

### **Maintainability**
- **Component composition**: Build complex UIs from simple components
- **Props interfaces**: Define clear TypeScript interfaces
- **Consistent naming**: Follow established naming conventions
- **Documentation**: Document complex components and patterns

---

**This design system ensures consistency across all future additions to the Flow Pilot project. Every new component should follow these established patterns and principles.**
