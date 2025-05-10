import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { HexColorPicker } from "react-colorful";
import { IoLogoGithub } from "react-icons/io";

const state = proxy({
  current: null,
  items: {
    laces: "#fff",
    mesh: "#fff",
    caps: "#fff",
    inner: "#fff",
    sole: "#fff",
    stripes: "#fff",
    band: "#fff",
    patch: "#fff",
  },
}); // Valtio State Management

function Shoe(props) {
  const snap = useSnapshot(state); // to use the state in the shoe
  const ref = useRef();

  const [hovered, setHovered] = useState(null);

  const { nodes, materials } = useGLTF("shoe-draco.glb");

  useEffect(() => {
    // Custom SVG, cursor has the color of the hovered from our state
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`;
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), auto`);
    }
  }, [hovered]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.set(
      Math.cos(t / 4) / 8,
      Math.sin(t / 4) / 8,
      -0.2 - (1 + Math.sin(t / 1.5)) / 20
    );
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      // hover
      onPointerOver={(e) => {
        e.stopPropagation(), setHovered(e.object.material.name);
      }} // these are for events on the shoe
      onPointerOut={(e) => {
        e.intersections.length === 0 && setHovered(null);
      }} // check if still on object
      //clicks
      onPointerDown={(e) => {
        e.stopPropagation();
        state.current = e.object.material.name;
      }}
      //click and missed
      onPointerMissed={(e) => {
        state.current = null;
      }}
    >
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe.geometry}
        material={materials.laces}
        material-color={snap.items.laces}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color={snap.items.mesh}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color={snap.items.caps}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color={snap.items.inner}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color={snap.items.sole}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color={snap.items.stripes}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color={snap.items.band}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color={snap.items.patch}
      />
    </group>
  );
}

function Picker() {
  const snap = useSnapshot(state);
  return (
    <div className=" flex flex-col md:flex-col   gap-4 md:gap-8  justify-center items-center  bg-gray-100 rounded-xl">
      {/* Snap is the state from valtio, in that object, choosing the .items and in the items object chosing the color of the current chosen by [current]
      bascially for the color picker to show the color of the current selected object on the shoe*/}
      <HexColorPicker
        className="w-24"
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />

      <h1 className="text-2xl md:text-5xl font-extralight capitalize select-none	">
        {snap.current ? snap.current : "Choose"}
      </h1>
    </div>
  );
}

export default function App() {
  const ref = useRef();
  const orbitref = useRef();

  function downloadScreenshot() {
    const image = ref.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.setAttribute("download", "screenshot.png");
    a.setAttribute("href", image);
    a.click();
  }

  let initialPosition = window.innerWidth < 500 ? [0, 0, 4.25] : [0, 0, 3.25];

  return (
   <div className="w-full min-h-screen bg-white font-sans text-gray-900">
  {/* Hero Section - Modern Design */}
  <section className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden bg-white">
    {/* Decorative Elements */}
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      
      {/* Floating abstract shapes */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-50 blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-purple-50 blur-3xl opacity-30 animate-float"></div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center max-w-4xl px-4">
      {/* Animated tagline */}
      <div className="inline-block mb-6 px-4 py-2 bg-gray-100 rounded-full">
        <p className="text-sm md:text-base font-medium text-gray-600 animate-fade-in">
          ✨ Next-Gen Shoe Customization
        </p>
      </div>

      {/* Main heading with elegant typography */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        <span className="block text-gray-800">Craft Your</span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
          Signature Style
        </span>
      </h1>

      {/* Subtitle with animated border */}
      <div className="relative inline-block mb-8 max-w-2xl">
        <p className="text-lg md:text-xl text-gray-600 relative z-10 px-6 py-2">
          Design luxury footwear that matches your unique personality with our 3D customization platform.
        </p>
        <div className="absolute inset-0 border border-gray-200 rounded-full opacity-30"></div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Designing
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>

        <button className="bg-white text-gray-700 font-medium py-3 px-6 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors duration-300">
          View Gallery
        </button>
      </div>

      {/* Stats counter - subtle animation */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-gray-500">
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-2xl font-bold text-gray-700">10K+</div>
          <div className="text-sm">Designs Created</div>
        </div>
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-2xl font-bold text-gray-700">98%</div>
          <div className="text-sm">Customer Satisfaction</div>
        </div>
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-2xl font-bold text-gray-700">24h</div>
          <div className="text-sm">Fast Delivery</div>
        </div>
      </div>
    </div>

    {/* Scroll indicator - elegant animation */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-400 mb-2">Scroll Down</span>
        <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  </section>


    {/* Configurator Section */}
    <section className="flex flex-col-reverse md:flex-row items-center justify-center w-full min-h-screen px-4 md:px-12 bg-white">
      
      <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 relative z-10">
          <div className="backdrop-blur-lg bg-white/80 p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Color Customizer</h2>
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-full bg-white p-6 rounded-xl shadow-inner border border-gray-200">
                <HexColorPicker
                  className="w-full h-64"
                  color={state.items[state.current]}
                  onChange={(color) => (state.items[state.current] = color)}
                />
              </div>
              
              <div className="w-full text-center">
                <p className="text-xl font-medium capitalize mb-4 text-gray-700">
                  {state.current ? state.current : "Select a part"}
                </p>
                
                <button
                  onClick={() => {
                    orbitref.current.reset();
                    setTimeout(() => {
                      downloadScreenshot();
                    }, 1500);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
                >
                  Take Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* 3D Canvas */}
      <div className="w-full md:w-2/3 h-[800px] md:h-[800px]">
        <Canvas
          shadows
          camera={{ position: initialPosition, fov: 45 }}
          ref={ref}
          gl={{ preserveDrawingBuffer: true }}
        >
          <ambientLight intensity={0.7} />
          <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
          <Shoe />
          <Environment preset="city" />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
          <OrbitControls ref={orbitref} maxPolarAngle={Math.PI / 2} enableZoom={false} />
        </Canvas>
      </div>
    </section>

    {/* Features Section with Glass Morphism */}
      <section className="py-16 px-8 md:px-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-40 z-0"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Why Choose Our Customizer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Real-Time 3D Preview</h3>
              <p className="text-gray-600">See your customizations come to life instantly with our high-fidelity 3D rendering.</p>
            </div>
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Precision Customization</h3>
              <p className="text-gray-600">Control every detail with our advanced material segmentation technology.</p>
            </div>
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Sharing</h3>
              <p className="text-gray-600">Save and share your creations with friends in just one click.</p>
            </div>
          </div>
        </div>
      </section>
  
  </div>
);

}
