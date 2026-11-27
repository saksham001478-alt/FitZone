import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const OUTPUT_PDF = path.resolve('FitZone_Complete_Code_and_Architecture_Guide.pdf');
const ARTIFACT_PDF = path.resolve('C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\2f7246ff-408c-4ac3-9279-243f1abc2d1f\\FitZone_Complete_Code_and_Architecture_Guide.pdf');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FitZone — Complete Code & Architecture Guide</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
  }
  h1 {
    font-size: 26pt;
    margin-bottom: 4px;
    color: #4338ca;
    border-bottom: 3px solid #6366f1;
    padding-bottom: 8px;
  }
  h2 {
    font-size: 16pt;
    margin-top: 24pt;
    margin-bottom: 8pt;
    color: #1e1b4b;
    border-bottom: 1.5px solid #cbd5e1;
    padding-bottom: 4px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13pt;
    margin-top: 16pt;
    margin-bottom: 6pt;
    color: #3730a3;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11pt;
    margin-top: 12pt;
    margin-bottom: 4pt;
    color: #0f172a;
  }
  p, li {
    font-size: 10pt;
    color: #334155;
  }
  ul, ol {
    margin-top: 4px;
    margin-bottom: 10px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 4px;
  }
  code {
    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
    font-size: 9pt;
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 4px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    font-family: 'Cascadia Code', 'Consolas', monospace;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 8pt 0 12pt 0;
  }
  pre .kw { color: #cba6f7; font-weight: bold; }
  pre .fn { color: #38bdf8; }
  pre .str { color: #4ade80; }
  pre .cm { color: #94a3b8; font-style: italic; }
  pre .num { color: #fb923c; }
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #6366f1;
    padding: 10px 14px;
    border-radius: 6px;
    margin: 10pt 0;
    page-break-inside: avoid;
  }
  .card-warn {
    border-left-color: #f59e0b;
    background: #fffbeb;
  }
  .card-success {
    border-left-color: #10b981;
    background: #f0fdf4;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 10px;
    text-align: left;
  }
  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  .page-break {
    page-break-before: always;
  }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 8pt;
    font-weight: 600;
    border-radius: 4px;
    background: #e0e7ff;
    color: #3730a3;
  }
  .tag-green { background: #dcfce7; color: #166534; }
  .tag-amber { background: #fef3c7; color: #92400e; }
  .tag-rose { background: #ffe4e6; color: #9f1239; }
</style>
</head>
<body>

<!-- COVER / HEADER -->
<div>
  <div style="font-size: 10pt; color: #6366f1; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Comprehensive Codebase & Viva Preparation Manual</div>
  <h1>FitZone — Complete Architecture & Line-by-Line Code Explanation</h1>
  <p style="font-size: 11pt; color: #475569; margin-top: -2px;">
    <strong>Role-Based Single Page Application (SPA)</strong> • React 19.2 • React Router DOM v7 • Zustand v5 • Context API • Vite 8
  </p>
  <div class="card card-success">
    <strong>🎯 Target Viva Evaluation:</strong> Grade Excellent across all 4 syllabus rubrics:
    <ol style="margin: 4px 0 0 16px; padding: 0;">
      <li><strong>React Navigation, Layout & Page Structure:</strong> 7-8 / 8 Marks</li>
      <li><strong>Context API & State Architecture:</strong> 6-8 / 8 Marks</li>
      <li><strong>Intro to Redux Toolkit (Zustand Global Store):</strong> 3-5 / 5 Marks</li>
      <li><strong>Form Handling in React:</strong> 3-4 / 4 Marks</li>
    </ol>
  </div>
</div>

<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 18pt 0;" />

<!-- CHAPTER 1: APPLICATION ENTRY & BOOTSTRAP -->
<h2>1. Application Entry Point & Provider Chain</h2>
<h3>1.1 <code>src/main.jsx</code> — Root Mounting & Provider Tree</h3>
<p>
  <code>main.jsx</code> is the absolute starting point of the React runtime. It connects the virtual DOM tree directly to the real browser DOM at element <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.
</p>
<pre>
<span class="kw">import</span> { StrictMode } <span class="kw">from</span> <span class="str">'react'</span>;
<span class="kw">import</span> { createRoot } <span class="kw">from</span> <span class="str">'react-dom/client'</span>;
<span class="kw">import</span> { BrowserRouter } <span class="kw">from</span> <span class="str">'react-router-dom'</span>;
<span class="kw">import</span> { AuthProvider } <span class="kw">from</span> <span class="str">'./context/AuthContext'</span>;
<span class="kw">import</span> { ThemeProvider } <span class="kw">from</span> <span class="str">'./context/ThemeContext'</span>;
<span class="kw">import</span> { NotificationProvider } <span class="kw">from</span> <span class="str">'./context/NotificationContext'</span>;
<span class="kw">import</span> App <span class="kw">from</span> <span class="str">'./App.jsx'</span>;
<span class="kw">import</span> <span class="str">'./index.css'</span>;

createRoot(document.getElementById(<span class="str">'root'</span>)).render(
  &lt;<span class="fn">StrictMode</span>&gt;
    &lt;<span class="fn">BrowserRouter</span>&gt;
      &lt;<span class="fn">AuthProvider</span>&gt;
        &lt;<span class="fn">ThemeProvider</span>&gt;
          &lt;<span class="fn">NotificationProvider</span>&gt;
            &lt;<span class="fn">App</span> /&gt;
          &lt;/<span class="fn">NotificationProvider</span>&gt;
        &lt;/<span class="fn">ThemeProvider</span>&gt;
      &lt;/<span class="fn">AuthProvider</span>&gt;
    &lt;/<span class="fn">BrowserRouter</span>&gt;
  &lt;/<span class="fn">StrictMode</span>&gt;
);
</pre>
<h4>Line-by-Line Breakdown:</h4>
<ul>
  <li><strong>Line 1:</strong> Imports <code>StrictMode</code>, a development tool that runs checks, verifies idempotent renders, and highlights legacy lifecycle patterns.</li>
  <li><strong>Line 2:</strong> Imports <code>createRoot</code> from React 19’s client package to mount concurrent React applications.</li>
  <li><strong>Line 3:</strong> Imports <code>BrowserRouter</code> from React Router DOM v7, providing the HTML5 History API (pushState, replaceState, popstate).</li>
  <li><strong>Lines 4-6:</strong> Imports the three global Context Providers: <code>AuthProvider</code> (user authentication and role state), <code>ThemeProvider</code> (dark/light theme toggle), and <code>NotificationProvider</code> (toast alert queue).</li>
  <li><strong>Lines 10-21:</strong> Mounts the nested provider chain. The nesting order is crucial: <code>BrowserRouter</code> must wrap everything so that contexts can utilize routing navigation if required. Inside it, <code>AuthProvider</code>, <code>ThemeProvider</code>, and <code>NotificationProvider</code> wrap <code>&lt;App /&gt;</code>, ensuring any page, layout, or button in the entire app can consume auth state, theme toggles, and toast alerts with zero prop drilling.</li>
</ul>

<!-- CHAPTER 2: ROUTING & SECURITY -->
<h2>2. Route Configuration & Security Guards</h2>
<h3>2.1 <code>src/App.jsx</code> — Complete Routing Architecture</h3>
<p>
  <code>App.jsx</code> orchestrates the entire routing system of the application, declaring public routes, protected admin layouts, and protected customer layouts.
</p>
<pre>
<span class="cm">// App.jsx — Key Sections</span>
<span class="kw">function</span> <span class="fn">RootRedirect</span>() {
  <span class="kw">const</span> { isAuthenticated, role } = <span class="fn">useAuth</span>();
  <span class="kw">if</span> (!isAuthenticated) <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/login"</span> replace /&gt;;
  <span class="kw">if</span> (role === <span class="str">'admin'</span>) <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/admin"</span> replace /&gt;;
  <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/app"</span> replace /&gt;;
}

<span class="kw">function</span> <span class="fn">App</span>() {
  <span class="kw">return</span> (
    &lt;&gt;
      &lt;<span class="fn">Toast</span> /&gt;
      &lt;<span class="fn">Routes</span>&gt;
        <span class="cm">{/* Public Routes */}</span>
        &lt;<span class="fn">Route</span> path=<span class="str">"/"</span> element={&lt;<span class="fn">RootRedirect</span> /&gt;} /&gt;
        &lt;<span class="fn">Route</span> path=<span class="str">"/login"</span> element={&lt;<span class="fn">Login</span> /&gt;} /&gt;
        &lt;<span class="fn">Route</span> path=<span class="str">"/register"</span> element={&lt;<span class="fn">Register</span> /&gt;} /&gt;

        <span class="cm">{/* Admin Routes Protected Shell */}</span>
        &lt;<span class="fn">Route</span> path=<span class="str">"/admin"</span> element={
          &lt;<span class="fn">ProtectedRoute</span> allowedRole=<span class="str">"admin"</span>&gt;
            &lt;<span class="fn">AdminLayout</span> /&gt;
          &lt;/<span class="fn">ProtectedRoute</span>&gt;
        }&gt;
          &lt;<span class="fn">Route</span> <span class="kw">index</span> element={&lt;<span class="fn">AdminDashboard</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"members"</span> element={&lt;<span class="fn">MemberList</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"members/:id"</span> element={&lt;<span class="fn">MemberDetail</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"plans"</span> element={&lt;<span class="fn">MembershipPlans</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"attendance"</span> element={&lt;<span class="fn">AttendanceTracker</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"diet"</span> element={&lt;<span class="fn">AdminDietPlans</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"diet/:type"</span> element={&lt;<span class="fn">AdminDietPlans</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"fitness"</span> element={&lt;<span class="fn">FitnessTracker</span> /&gt;}&gt;
            &lt;<span class="fn">Route</span> path=<span class="str">"progress"</span> element={&lt;<span class="fn">ProgressChart</span> /&gt;} /&gt;
          &lt;/<span class="fn">Route</span>&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"shop"</span> element={&lt;<span class="fn">ManageShop</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"orders"</span> element={&lt;<span class="fn">ManageShop</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"settings"</span> element={&lt;<span class="fn">AdminSettings</span> /&gt;} /&gt;
        &lt;/<span class="fn">Route</span>&gt;

        <span class="cm">{/* Customer Routes Protected Shell */}</span>
        &lt;<span class="fn">Route</span> path=<span class="str">"/app"</span> element={
          &lt;<span class="fn">ProtectedRoute</span> allowedRole=<span class="str">"customer"</span>&gt;
            &lt;<span class="fn">CustomerLayout</span> /&gt;
          &lt;/<span class="fn">ProtectedRoute</span>&gt;
        }&gt;
          &lt;<span class="fn">Route</span> <span class="kw">index</span> element={&lt;<span class="fn">CustomerDashboard</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"profile"</span> element={&lt;<span class="fn">MyProfile</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"attendance"</span> element={&lt;<span class="fn">MyAttendance</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"plan"</span> element={&lt;<span class="fn">MyPlan</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"diet"</span> element={&lt;<span class="fn">CustomerDiet</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"diet/:type"</span> element={&lt;<span class="fn">CustomerDiet</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"fitness"</span> element={&lt;<span class="fn">MyFitness</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"shop"</span> element={&lt;<span class="fn">Shop</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"shop/cart"</span> element={&lt;<span class="fn">Cart</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"contact"</span> element={&lt;<span class="fn">Contact</span> /&gt;} /&gt;
          &lt;<span class="fn">Route</span> path=<span class="str">"settings"</span> element={&lt;<span class="fn">CustomerSettings</span> /&gt;} /&gt;
        &lt;/<span class="fn">Route</span>&gt;

        <span class="cm">{/* Catch-All 404 Route */}</span>
        &lt;<span class="fn">Route</span> path=<span class="str">"*"</span> element={&lt;<span class="fn">NotFound</span> /&gt;} /&gt;
      &lt;/<span class="fn">Routes</span>&gt;
    &lt;/&gt;
  );
}
</pre>
<h4>Working & Navigation Logic:</h4>
<ul>
  <li><code>RootRedirect</code> Component (Lines 40-46): Serves as an intelligent traffic director. When a user arrives at <code>/</code>, it queries <code>useAuth()</code>. If unauthenticated, it redirects to <code>/login</code>. If authenticated as admin, it routes to <code>/admin</code>. If authenticated as customer, it routes to <code>/app</code>.</li>
  <li><strong>Top-Level Toast:</strong> <code>&lt;Toast /&gt;</code> is rendered right above <code>&lt;Routes&gt;</code>. Because it is rendered outside the route tree, toast notifications persist across page transitions without unmounting.</li>
  <li><strong>Nested Route Shells:</strong> The routes <code>/admin</code> and <code>/app</code> wrap their child routes. <code>AdminLayout</code> and <code>CustomerLayout</code> contain the sidebars and headers, while their child pages render inside the layout’s <code>&lt;Outlet /&gt;</code>.</li>
  <li><strong>Dynamic Parameter Routes:</strong> <code>members/:id</code> and <code>diet/:type</code> allow arbitrary member IDs and diet slugs to be captured dynamically using React Router's <code>useParams()</code> hook.</li>
  <li><strong>Nested Sub-Routes:</strong> <code>&lt;Route path="fitness"&gt;&lt;Route path="progress" /&gt;&lt;/Route&gt;</code> creates a double-nested route structure where <code>ProgressChart</code> renders inside <code>FitnessTracker</code>'s own internal <code>&lt;Outlet /&gt;</code>.</li>
</ul>

<h3>2.2 <code>src/components/ProtectedRoute.jsx</code> — Route Guard Engine</h3>
<pre>
<span class="kw">export function</span> <span class="fn">ProtectedRoute</span>({ allowedRole, children }) {
  <span class="kw">const</span> { isAuthenticated, role } = <span class="fn">useAuth</span>();

  <span class="cm">// Step 1: Check authentication status</span>
  <span class="kw">if</span> (!isAuthenticated) {
    <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/login"</span> replace /&gt;;
  }

  <span class="cm">// Step 2: Verify role authorization</span>
  <span class="kw">if</span> (allowedRole && role !== allowedRole) {
    <span class="kw">if</span> (role === <span class="str">'admin'</span>) {
      <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/admin"</span> replace /&gt;;
    }
    <span class="kw">return</span> &lt;<span class="fn">Navigate</span> to=<span class="str">"/app"</span> replace /&gt;;
  }

  <span class="cm">// Step 3: Render protected view</span>
  <span class="kw">return</span> children ? children : &lt;<span class="fn">Outlet</span> /&gt;;
}
</pre>
<h4>Working & Security Principles:</h4>
<ol>
  <li><strong>Authentication Verification:</strong> If <code>isAuthenticated === false</code>, the user is immediately halted and redirected to <code>/login</code> via <code>&lt;Navigate replace /&gt;</code> (replacing history so back-button cannot re-enter).</li>
  <li><strong>Role-Based Access Control (RBAC):</strong> If the route specifies <code>allowedRole="admin"</code> and a customer user attempts to open it, line 17 routes them safely back to their own <code>/app</code> dashboard. Vice versa, if an admin attempts to browse customer routes, they are sent to <code>/admin</code>.</li>
  <li><strong>Pass-Through Rendering:</strong> If both checks pass, it returns <code>children</code> or <code>&lt;Outlet /&gt;</code> to render the target layout.</li>
</ol>

<div class="page-break"></div>

<!-- CHAPTER 3: STATE MANAGEMENT ARCHITECTURE -->
<h2>3. Context API & State Architecture</h2>
<h3>3.1 <code>src/context/AuthContext.jsx</code> — Authentication & Member Management</h3>
<p>
  <code>AuthContext.jsx</code> is the core state hub of the application. It manages user credentials, simulated asynchronous authentication, member records, and profile updates.
</p>
<pre>
<span class="kw">const</span> AuthContext = <span class="fn">createContext</span>(<span class="kw">null</span>);

<span class="kw">const</span> ADMIN_CREDENTIALS = {
  email: <span class="str">'admin@fitzone.com'</span>,
  password: <span class="str">'admin123'</span>,
};

<span class="kw">export function</span> <span class="fn">AuthProvider</span>({ children }) {
  <span class="cm">// Lazy state initialization from localStorage</span>
  <span class="kw">const</span> [user, setUser] = <span class="fn">useState</span>(() => {
    <span class="kw">try</span> {
      <span class="kw">const</span> savedUser = localStorage.getItem(<span class="str">'fitzone_user'</span>);
      <span class="kw">return</span> savedUser ? JSON.parse(savedUser) : <span class="kw">null</span>;
    } <span class="kw">catch</span> { <span class="kw">return</span> <span class="kw">null</span>; }
  });

  <span class="kw">const</span> [members, setMembersState] = <span class="fn">useState</span>(() => {
    <span class="kw">try</span> {
      <span class="kw">const</span> savedMembers = localStorage.getItem(<span class="str">'members'</span>);
      <span class="kw">if</span> (savedMembers) {
        <span class="kw">const</span> parsed = JSON.parse(savedMembers);
        <span class="kw">if</span> (Array.isArray(parsed) && parsed.length > <span class="num">0</span>) <span class="kw">return</span> parsed;
      }
      localStorage.setItem(<span class="str">'members'</span>, JSON.stringify(initialDefaultMembers));
      <span class="kw">return</span> initialDefaultMembers;
    } <span class="kw">catch</span> { <span class="kw">return</span> initialDefaultMembers; }
  });

  <span class="cm">// Synchronized setter for members</span>
  <span class="kw">const</span> setMembers = <span class="fn">useCallback</span>((updater) => {
    setMembersState((prev) => {
      <span class="kw">const</span> nextMembers = <span class="kw">typeof</span> updater === <span class="str">'function'</span> ? updater(prev) : updater;
      localStorage.setItem(<span class="str">'members'</span>, JSON.stringify(nextMembers));
      <span class="kw">return</span> nextMembers;
    });
  }, []);

  <span class="cm">// Async Login with 800ms Network Simulation</span>
  <span class="kw">const</span> login = <span class="fn">useCallback</span>(<span class="kw">async</span> (email, password, isAdmin = <span class="kw">false</span>) => {
    <span class="kw">await new</span> Promise((res) => setTimeout(res, <span class="num">800</span>));
    <span class="kw">const</span> cleanEmail = (email || <span class="str">''</span>).trim().toLowerCase();
    <span class="kw">const</span> cleanPassword = (password || <span class="str">''</span>).trim();

    <span class="cm">// Validate Admin</span>
    <span class="kw">if</span> (isAdmin || cleanEmail === ADMIN_CREDENTIALS.email) {
      <span class="kw">if</span> (cleanEmail === ADMIN_CREDENTIALS.email && cleanPassword === ADMIN_CREDENTIALS.password) {
        <span class="kw">const</span> adminUser = { id: <span class="str">'admin'</span>, name: <span class="str">'Admin'</span>, email: ADMIN_CREDENTIALS.email, role: <span class="str">'admin'</span> };
        setUser(adminUser);
        localStorage.setItem(<span class="str">'fitzone_user'</span>, JSON.stringify(adminUser));
        <span class="kw">return</span> { success: <span class="kw">true</span>, user: adminUser };
      }
      <span class="kw">return</span> { success: <span class="kw">false</span>, error: <span class="str">'Invalid admin credentials'</span> };
    }

    <span class="cm">// Validate Customer Against Members Array</span>
    <span class="kw">const</span> member = members.find((m) =>
      m.email?.toLowerCase().trim() === cleanEmail &&
      (m.password === cleanPassword || (!m.password && cleanPassword === <span class="str">'password123'</span>))
    );
    <span class="kw">if</span> (!member) <span class="kw">return</span> { success: <span class="kw">false</span>, error: <span class="str">'Invalid email or password'</span> };

    <span class="kw">const</span> customerUser = { ...member, role: <span class="str">'customer'</span> };
    setUser(customerUser);
    localStorage.setItem(<span class="str">'fitzone_user'</span>, JSON.stringify(customerUser));
    <span class="kw">return</span> { success: <span class="kw">true</span>, user: customerUser };
  }, [members]);

  <span class="cm">// Memoized Context Value to optimize re-renders</span>
  <span class="kw">const</span> value = <span class="fn">useMemo</span>(() => ({
    user, role: user?.role || <span class="kw">null</span>, isAuthenticated: Boolean(user),
    members, setMembers, login, register, logout, updateProfile
  }), [user, members, setMembers, login, register, logout, updateProfile]);

  <span class="kw">return</span> &lt;<span class="fn">AuthContext.Provider</span> value={value}&gt;{children}&lt;/<span class="fn">AuthContext.Provider</span>&gt;;
}
</pre>
<h4>Line-by-Line Key Concepts:</h4>
<ul>
  <li><strong>Lazy State Initializer:</strong> <code>useState(() => { ... })</code> uses an initialization function. This guarantees <code>localStorage.getItem()</code> and <code>JSON.parse()</code> execute only once during initial mount rather than on every render, optimizing performance.</li>
  <li><strong>Automatic LocalStorage Synchronization:</strong> In <code>setMembers</code>, any modification automatically serializes the new member state into <code>localStorage.setItem('members', ...)</code>.</li>
  <li><strong>Asynchronous Delay Simulation:</strong> <code>await new Promise(res => setTimeout(res, 800))</code> simulates real-world REST API network latency, allowing loaders and disabled submit states to be exercised realistically.</li>
  <li><strong>useMemo Context Optimization:</strong> The context <code>value</code> object is wrapped inside <code>useMemo</code>. Without this, every re-render of <code>AuthProvider</code> would instantiate a new object reference, forcing every consumer component across the app to re-render unnecessarily.</li>
</ul>

<h3>3.2 <code>src/context/ThemeContext.jsx</code> — Dark/Light Theming Engine</h3>
<pre>
<span class="kw">export function</span> <span class="fn">ThemeProvider</span>({ children }) {
  <span class="kw">const</span> [darkMode, setDarkMode] = <span class="fn">useLocalStorage</span>(<span class="str">'darkMode'</span>, <span class="kw">false</span>);

  <span class="fn">useEffect</span>(() => {
    <span class="kw">if</span> (darkMode) {
      document.documentElement.setAttribute(<span class="str">'data-theme'</span>, <span class="str">'dark'</span>);
    } <span class="kw">else</span> {
      document.documentElement.removeAttribute(<span class="str">'data-theme'</span>);
    }
  }, [darkMode]);

  <span class="kw">const</span> toggleTheme = <span class="fn">useCallback</span>(() => setDarkMode((prev) => !prev), [setDarkMode]);
  <span class="kw">const</span> value = <span class="fn">useMemo</span>(() => ({ darkMode: Boolean(darkMode), toggleTheme }), [darkMode, toggleTheme]);

  <span class="kw">return</span> &lt;<span class="fn">ThemeContext.Provider</span> value={value}&gt;{children}&lt;/<span class="fn">ThemeContext.Provider</span>&gt;;
}
</pre>
<h4>Working:</h4>
<p>
  When <code>toggleTheme()</code> is triggered, <code>darkMode</code> flips. The <code>useEffect</code> reacts to this state change by setting <code>data-theme="dark"</code> on the root <code>&lt;html&gt;</code> element. CSS variables declared in <code>App.css</code> then invert color variables automatically:
</p>
<pre>
:root { --bg-primary: #ffffff; --text-primary: #0f172a; --bg-card: #f8fafc; }
[data-theme="dark"] { --bg-primary: #0f172a; --text-primary: #f8fafc; --bg-card: #1e293b; }
</pre>

<h3>3.3 <code>src/context/NotificationContext.jsx</code> — Toast Alert Queue</h3>
<pre>
<span class="kw">export function</span> <span class="fn">NotificationProvider</span>({ children }) {
  <span class="kw">const</span> [notifications, setNotifications] = <span class="fn">useState</span>([]);
  <span class="kw">const</span> timersRef = <span class="fn">useRef</span>({});

  <span class="kw">const</span> dismissToast = <span class="fn">useCallback</span>((id) => {
    <span class="kw">if</span> (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      <span class="kw">delete</span> timersRef.current[id];
    }
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  <span class="kw">const</span> showToast = <span class="fn">useCallback</span>((message, type = <span class="str">'success'</span>) => {
    <span class="kw">const</span> id = <span class="str">\`\${Date.now()}-\${Math.random().toString(36).substring(2, 7)}\`</span>;
    <span class="kw">const</span> newToast = { id, message, type };
    setNotifications((prev) => [...prev, newToast]);

    <span class="kw">const</span> timerId = setTimeout(() => { dismissToast(id); }, <span class="num">3000</span>);
    timersRef.current[id] = timerId;
    <span class="kw">return</span> id;
  }, [dismissToast]);

  ...
}
</pre>
<h4>Working & Memory Safety:</h4>
<ul>
  <li><code>timersRef = useRef({})</code>: Stores active <code>setTimeout</code> timer references without triggering re-renders when keys are added or removed.</li>
  <li><strong>Auto-Dismissal:</strong> Each toast sets a 3000ms timer that calls <code>dismissToast(id)</code>.</li>
  <li><strong>Memory Leak Prevention:</strong> If a user clicks the dismiss "✕" button before 3 seconds, <code>clearTimeout</code> cancels the active timer and deletes it from <code>timersRef</code>.</li>
</ul>

<div class="page-break"></div>

<!-- CHAPTER 4: REDUX TOOLKIT & ZUSTAND STORE -->
<h2>4. Global State: Redux Toolkit Architecture via Zustand</h2>
<h3>4.1 <code>src/store/cartStore.js</code> — Shopping Cart Store</h3>
<pre>
<span class="kw">import</span> { create } <span class="kw">from</span> <span class="str">'zustand'</span>;

<span class="kw">const</span> CART_STORAGE_KEY = <span class="str">'fitzone_cart'</span>;

<span class="kw">export const</span> useCartStore = <span class="fn">create</span>((set, get) => ({
  items: <span class="fn">getStoredCartItems</span>(),

  <span class="cm">// Action: Add Item (like a Redux slice reducer)</span>
  addItem: (product) => {
    <span class="kw">if</span> (!product || product.id == <span class="kw">null</span>) <span class="kw">return</span>;
    <span class="fn">set</span>((state) => {
      <span class="kw">const</span> existingIndex = state.items.findIndex(
        (item) => String(item.product?.id) === String(product.id)
      );
      <span class="kw">if</span> (existingIndex > -<span class="num">1</span>) {
        <span class="kw">const</span> updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || <span class="num">1</span>) + <span class="num">1</span>,
        };
        <span class="kw">return</span> { items: updated };
      }
      <span class="kw">return</span> { items: [...state.items, { product, quantity: <span class="num">1</span> }] };
    });
  },

  <span class="cm">// Action: Remove Item</span>
  removeItem: (productId) => {
    <span class="fn">set</span>((state) => ({
      items: state.items.filter((item) => String(item.product?.id) !== String(productId)),
    }));
  },

  <span class="cm">// Action: Update Quantity</span>
  updateQuantity: (productId, qty) => {
    <span class="kw">const</span> numericQty = Number(qty);
    <span class="kw">if</span> (numericQty <= <span class="num">0</span>) { get().removeItem(productId); <span class="kw">return</span>; }
    <span class="fn">set</span>((state) => ({
      items: state.items.map((item) =>
        String(item.product?.id) === String(productId) ? { ...item, quantity: numericQty } : item
      ),
    }));
  },

  <span class="cm">// Selectors (derived computations)</span>
  getTotal: () => {
    <span class="kw">const</span> { items } = get();
    <span class="kw">return</span> items.reduce((total, item) => total + (Number(item.product?.price) || <span class="num">0</span>) * (item.quantity || <span class="num">1</span>), <span class="num">0</span>);
  },
  getItemCount: () => {
    <span class="kw">const</span> { items } = get();
    <span class="kw">return</span> items.reduce((count, item) => count + (Number(item.quantity) || <span class="num">0</span>), <span class="num">0</span>);
  },
}));

<span class="cm">// Store Middleware: Automatic Persistence</span>
useCartStore.<span class="fn">subscribe</span>((state) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
});
</pre>
<h4>Redux Toolkit Viva Alignment Matrix (3-5 Marks):</h4>
<table>
  <tr><th>Redux Toolkit Primitive</th><th>FitZone Zustand Implementation</th><th>Architectural Purpose</th></tr>
  <tr><td><code>configureStore({ reducer })</code></td><td><code>create((set, get) => ({ ... }))</code></td><td>Initializes immutable centralized state container.</td></tr>
  <tr><td><code>createSlice({ reducers })</code></td><td>Actions inside store: <code>addItem</code>, <code>removeItem</code></td><td>Encapsulates state mutation logic in pure action functions.</td></tr>
  <tr><td><code>useSelector(state => state.cart)</code></td><td><code>useCartStore(state => state.items)</code></td><td>Component subscribes to exact slice of state, avoiding global re-renders.</td></tr>
  <tr><td><code>dispatch(addItem(item))</code></td><td><code>addItem(item)</code></td><td>Action is called directly without dispatch wrapper boilerplate.</td></tr>
  <tr><td>Redux Middleware (e.g. redux-persist)</td><td><code>useCartStore.subscribe()</code></td><td>Subscribes to all state updates to serialize cart into <code>localStorage</code>.</td></tr>
</table>

<!-- CHAPTER 5: CUSTOM HOOKS -->
<h2>5. Custom Hooks Architecture</h2>
<h3>5.1 <code>src/hooks/useLocalStorage.js</code></h3>
<p>Provides two-way binding between React state and browser localStorage.</p>
<pre>
<span class="kw">export function</span> <span class="fn">useLocalStorage</span>(key, initialValue) {
  <span class="kw">const</span> [value, setValue] = <span class="fn">useState</span>(() => {
    <span class="kw">try</span> {
      <span class="kw">const</span> item = localStorage.getItem(key);
      <span class="kw">return</span> item !== <span class="kw">null</span> ? JSON.parse(item) : initialValue;
    } <span class="kw">catch</span> { <span class="kw">return</span> initialValue; }
  });

  <span class="fn">useEffect</span>(() => {
    <span class="kw">try</span> {
      localStorage.setItem(key, JSON.stringify(value));
    } <span class="kw">catch</span> (err) { console.error(err); }
  }, [key, value]);

  <span class="kw">return</span> [value, setValue];
}
</pre>

<h3>5.2 <code>src/hooks/useSearch.js</code></h3>
<p>Memoized client-side search engine. Utilizes <code>useMemo</code> to prevent re-filtering arrays unless search term or items mutate.</p>
<pre>
<span class="kw">export function</span> <span class="fn">useSearch</span>(items, searchTerm = <span class="str">''</span>, keys = [<span class="str">'name'</span>]) {
  <span class="kw">return</span> <span class="fn">useMemo</span>(() => {
    <span class="kw">if</span> (!items || !Array.isArray(items)) <span class="kw">return</span> [];
    <span class="kw">if</span> (!searchTerm || !searchTerm.trim()) <span class="kw">return</span> items;
    <span class="kw">const</span> term = searchTerm.toLowerCase().trim();
    <span class="kw">return</span> items.filter((item) =>
      keys.some((key) => {
        <span class="kw">const</span> val = item?.[key];
        <span class="kw">return</span> val != <span class="kw">null</span> && String(val).toLowerCase().includes(term);
      })
    );
  }, [items, searchTerm, keys]);
}
</pre>

<div class="page-break"></div>

<!-- CHAPTER 6: FORM HANDLING ENGINE -->
<h2>6. Form Handling in React (Rubric 3-4 Marks)</h2>
<h3>6.1 <code>src/hooks/useFormValidation.js</code> — 10-Rule Validation Engine</h3>
<p>
  <code>useFormValidation</code> implements a production-grade controlled form engine supporting 10 validation types, touch tracking, and dynamic cross-field validation.
</p>
<pre>
<span class="kw">export function</span> <span class="fn">useFormValidation</span>(initialValues = {}, validationRules = {}) {
  <span class="kw">const</span> [values, setValuesState] = <span class="fn">useState</span>(initialValues);
  <span class="kw">const</span> [errors, setErrors] = <span class="fn">useState</span>({});
  <span class="kw">const</span> [touched, setTouched] = <span class="fn">useState</span>({});

  <span class="cm">// Single Field Setter with Cross-Field Re-validation</span>
  <span class="kw">const</span> setValue = <span class="fn">useCallback</span>((name, value) => {
    setValuesState((prev) => {
      <span class="kw">const</span> nextValues = { ...prev, [name]: value };

      <span class="cm">// Validate current field if already touched</span>
      <span class="kw">if</span> (touched[name]) {
        <span class="kw">const</span> err = <span class="fn">validateField</span>(value, validationRules?.[name], nextValues, name);
        setErrors((prevErr) => ({ ...prevErr, [name]: err }));
      }

      <span class="cm">// Re-validate dependent fields (e.g. confirmPassword matching password)</span>
      <span class="kw">if</span> (validationRules) {
        Object.entries(validationRules).forEach(([fieldKey, rules]) => {
          <span class="kw">if</span> (touched[fieldKey] && Array.isArray(rules)) {
            <span class="kw">const</span> hasMatch = rules.some((r) => r.type === <span class="str">'match'</span> && r.field === name);
            <span class="kw">if</span> (hasMatch) {
              <span class="kw">const</span> matchErr = <span class="fn">validateField</span>(nextValues[fieldKey], rules, nextValues, fieldKey);
              setErrors((prevErr) => ({ ...prevErr, [fieldKey]: matchErr }));
            }
          }
        });
      }
      <span class="kw">return</span> nextValues;
    });
  }, [touched, validationRules]);

  <span class="cm">// Event Handlers</span>
  <span class="kw">const</span> handleChange = <span class="fn">useCallback</span>((e) => {
    <span class="kw">const</span> { name, value, type, checked } = e.target;
    setValue(name, type === <span class="str">'checkbox'</span> ? checked : value);
  }, [setValue]);

  <span class="kw">const</span> handleBlur = <span class="fn">useCallback</span>((e) => {
    <span class="kw">const</span> { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: <span class="kw">true</span> }));
    <span class="kw">const</span> err = <span class="fn">validateField</span>(values[name], validationRules?.[name], values, name);
    setErrors((prev) => ({ ...prev, [name]: err }));
  }, [values, validationRules]);

  <span class="cm">// Validate All Fields on Form Submission</span>
  <span class="kw">const</span> validate = <span class="fn">useCallback</span>(() => {
    <span class="kw">const</span> nextErrors = {};
    <span class="kw">const</span> nextTouched = {};
    <span class="kw">let</span> isFormValid = <span class="kw">true</span>;
    Object.keys(validationRules).forEach((fieldName) => {
      nextTouched[fieldName] = <span class="kw">true</span>;
      <span class="kw">const</span> err = <span class="fn">validateField</span>(values[fieldName], validationRules[fieldName], values, fieldName);
      nextErrors[fieldName] = err;
      <span class="kw">if</span> (err) isFormValid = <span class="kw">false</span>;
    });
    setTouched((prev) => ({ ...prev, ...nextTouched }));
    setErrors(nextErrors);
    <span class="kw">return</span> isFormValid;
  }, [values, validationRules]);

  ...
}
</pre>
<h4>Form Validation Rules Supported:</h4>
<ul>
  <li><code>required</code>: Rejects empty strings, null, undefined, or false.</li>
  <li><code>email</code>: Enforces valid RFC email pattern regex.</li>
  <li><code>minLength / maxLength</code>: Validates character length constraints (e.g. password ≥ 8 chars).</li>
  <li><code>match</code>: Cross-field matching (e.g. <code>confirmPassword</code> === <code>password</code>).</li>
  <li><code>phone</code>: Checks phone numbers for minimum 10 digits.</li>
  <li><code>min / max</code>: Verifies numeric ranges (e.g. weight between 20kg and 300kg).</li>
  <li><code>pattern</code>: Tests input against custom regular expressions.</li>
  <li><code>custom</code>: Executes custom callback validator functions.</li>
</ul>

<h3>6.2 <code>src/components/FormInput.jsx</code> — Reusable Form Control</h3>
<p>
  A unified form component that renders <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, or <code>&lt;textarea&gt;</code> based on the <code>type</code> prop, complete with red error outlines and error message displays.
</p>
<pre>
<span class="kw">export function</span> <span class="fn">FormInput</span>({
  label, name, type = <span class="str">'text'</span>, value, onChange, onBlur,
  error, placeholder, required = <span class="kw">false</span>, options = [], rows = <span class="num">4</span>, ...rest
}) {
  <span class="kw">const</span> inputClass = <span class="str">\`\${error ? 'error input-error' : ''}\`</span>.trim();
  <span class="kw">return</span> (
    &lt;<span class="fn">div</span> className=<span class="str">"form-group"</span>&gt;
      {label && &lt;<span class="fn">label</span> htmlFor={name}&gt;{label}{required && &lt;<span class="fn">span</span> className=<span class="str">"required"</span>&gt; *&lt;/<span class="fn">span</span>&gt;}&lt;/<span class="fn">label</span>&gt;}
      {type === <span class="str">'select'</span> ? (
        &lt;<span class="fn">select</span> id={name} name={name} value={value ?? <span class="str">''</span>} onChange={onChange} onBlur={onBlur} className={inputClass}&gt;
          {options.map((opt) => &lt;<span class="fn">option</span> key={opt.value} value={opt.value}&gt;{opt.label}&lt;/<span class="fn">option</span>&gt;)}
        &lt;/<span class="fn">select</span>&gt;
      ) : type === <span class="str">'textarea'</span> ? (
        &lt;<span class="fn">textarea</span> id={name} name={name} value={value ?? <span class="str">''</span>} rows={rows} onChange={onChange} onBlur={onBlur} className={inputClass} /&gt;
      ) : (
        &lt;<span class="fn">input</span> id={name} name={name} type={type} value={value ?? <span class="str">''</span>} onChange={onChange} onBlur={onBlur} className={inputClass} /&gt;
      )}
      {error && &lt;<span class="fn">span</span> className=<span class="str">"error-text"</span>&gt;{error}&lt;/<span class="fn">span</span>&gt;}
    &lt;/<span class="fn">div</span>&gt;
  );
}
</pre>

<div class="page-break"></div>

<!-- CHAPTER 7: KEY UI COMPONENTS & PAGES -->
<h2>7. Key Components & Page Walkthroughs</h2>
<h3>7.1 <code>src/components/AdminLayout.jsx</code> & <code>CustomerLayout.jsx</code></h3>
<ul>
  <li><strong>AdminLayout:</strong> Houses the persistent 8-link admin navigation drawer, top search bar, theme toggle, and <code>&lt;Outlet context={{ members, setMembers, searchTerm }} /&gt;</code>.</li>
  <li><strong>CustomerLayout:</strong> Houses member navigation, top bar with live cart item badge (<code>useCartStore.getItemCount()</code>), user greeting, and <code>&lt;Outlet context={{ user }} /&gt;</code>.</li>
</ul>

<h3>7.2 <code>src/components/Modal.jsx</code> — Accessible Dialog System</h3>
<ul>
  <li><code>useRef</code> attaches to the close button and auto-focuses it upon opening for keyboard accessibility.</li>
  <li><code>useEffect</code> binds an <code>Escape</code> key event listener on <code>window</code> to dismiss the modal.</li>
  <li>Clicking the backdrop overlay calls <code>onClose()</code>, while <code>e.stopPropagation()</code> on modal content prevents accidental closing.</li>
</ul>

<h3>7.3 <code>src/pages/customer/Cart.jsx</code> & <code>Shop.jsx</code> — E-Commerce Flow</h3>
<ol>
  <li>In <code>Shop.jsx</code>, users browse products filtered by category pills or search terms.</li>
  <li>Clicking <strong>"+ Add to Cart"</strong> dispatches <code>useCartStore.addItem(product)</code>. The navbar badge updates instantly.</li>
  <li>In <code>Cart.jsx</code>, members adjust quantities (+/-). If quantity reaches 0, the item is removed.</li>
  <li>Subtotal is calculated via <code>items.reduce()</code>, 18% GST is added, and grand total is computed.</li>
  <li>Clicking <strong>"Proceed to Checkout"</strong> generates a unique <code>ORD-XXXXX</code> order ID, appends the order to <code>localStorage('orders')</code>, clears the cart, and alerts via <code>showToast('Order placed successfully!', 'success')</code>.</li>
</ol>

<h3>7.4 <code>src/pages/admin/FitnessTracker.jsx</code> & <code>ProgressChart.jsx</code> — Health Engine</h3>
<ul>
  <li>BMI Formula: <code>BMI = weight (kg) / (height(m) * height(m))</code>.</li>
  <li>Classification: Underweight (&lt;18.5), Normal (18.5 - 24.9), Overweight (25 - 29.9), Obese (30+).</li>
  <li>Saved records are stored under <code>localStorage('fitnessData')[memberId]</code>.</li>
  <li><code>ProgressChart.jsx</code> is rendered as a nested child route (<code>/admin/fitness/progress</code>) and calculates weight delta (first vs latest record) with color-coded CSS progress bars.</li>
</ul>

<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 18pt 0;" />

<!-- CHAPTER 8: TOP VIVA QUESTIONS & MODEL ANSWERS -->
<h2>8. Top 15 Viva Evaluation Q&A</h2>
<div class="card">
  <strong>Q1: Why did you use both Context API and Zustand in your project?</strong><br/>
  <em>Answer:</em> Context API is ideal for low-frequency global state like Authentication, Theme, and Toast notifications where values don’t change rapidly. Zustand was chosen for the shopping cart because it avoids re-rendering the whole component tree: only components that explicitly subscribe to cart state re-render when items change.
</div>
<div class="card">
  <strong>Q2: How does your Zustand store implement the Redux Toolkit architecture?</strong><br/>
  <em>Answer:</em> It implements a centralized store (<code>configureStore</code>), pure action mutators (<code>createSlice</code> reducers), selectors for derived totals (<code>useSelector</code>), direct action dispatching, and persistent listener middleware via <code>subscribe()</code>.
</div>
<div class="card">
  <strong>Q3: How does ProtectedRoute prevent unauthorized access?</strong><br/>
  <em>Answer:</em> It reads <code>isAuthenticated</code> and <code>role</code> from <code>AuthContext</code>. Unauthenticated users are redirected to <code>/login</code> via <code>&lt;Navigate replace /&gt;</code>. If a customer attempts to access <code>/admin/*</code>, the guard intercepts and redirects them back to <code>/app</code>.
</div>
<div class="card">
  <strong>Q4: What is the difference between <code>useMemo</code> and <code>useCallback</code>?</strong><br/>
  <em>Answer:</em> <code>useMemo</code> caches the <em>result</em> of an expensive calculation (e.g. member filtering in <code>useSearch</code> or derived cart totals), while <code>useCallback</code> caches the <em>function definition</em> itself across re-renders to maintain stable prop references.
</div>
<div class="card">
  <strong>Q5: How do dynamic and nested routes work in your application?</strong><br/>
  <em>Answer:</em> Dynamic routes like <code>/members/:id</code> use parameter placeholders extracted via <code>useParams()</code>. Nested routes like <code>/fitness/progress</code> render inside their parent component’s <code>&lt;Outlet /&gt;</code> without unmounting the parent shell.
</div>

<div style="text-align: center; margin-top: 30pt; font-size: 10pt; color: #64748b;">
  FitZone • Project Evaluation Documentation Manual • Generated for Academic Evaluation Viva
</div>

</body>
</html>
`;

async function buildPdf() {
  console.log('Generating PDF from comprehensive HTML guide...');

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Generate PDF
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm',
    },
  });

  // Also save copy to artifact directory
  fs.copyFileSync(OUTPUT_PDF, ARTIFACT_PDF);

  console.log('PDF generated successfully at:');
  console.log('1. ', OUTPUT_PDF);
  console.log('2. ', ARTIFACT_PDF);

  await browser.close();
}

buildPdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
