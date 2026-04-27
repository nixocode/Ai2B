"use client";

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_scroll;
uniform float u_focusIndex;
uniform float u_focusAmt;
uniform float u_orbit;
uniform float u_intro;
uniform float u_outro;

#define SALES    vec3(1.000, 0.353, 0.122)
#define SUPPORT  vec3(0.910, 0.365, 0.459)
#define OPS      vec3(1.000, 0.722, 0.302)
#define RESEARCH vec3(0.431, 0.659, 0.996)

float hash(vec3 p){ p = fract(p*0.3183099 + .1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
  vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y), f.z);
}
float fbm(vec3 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.07; a*=0.5; }
  return v;
}

float sdSphere(vec3 p, float r){ return length(p)-r; }
float smin(float a, float b, float k){
  float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);
  return mix(b,a,h)-k*h*(1.0-h);
}

vec3 agentPos(int i){
  float a = float(i)*1.5707963 + u_time*0.06;
  float r = mix(0.45, 1.6, u_orbit);
  vec3 p;
  if(i==0) p = vec3(cos(a)*r, sin(u_time*0.4)*0.2*u_orbit, sin(a)*r);
  else if(i==1) p = vec3(cos(a+1.2)*r*0.9, 0.55*u_orbit + sin(u_time*0.3+1.0)*0.15, sin(a+1.2)*r*0.9);
  else if(i==2) p = vec3(cos(a+2.4)*r*1.05, -0.55*u_orbit + cos(u_time*0.35+2.0)*0.15, sin(a+2.4)*r*1.05);
  else p = vec3(cos(a+3.6)*r*0.85, sin(u_time*0.45+3.0)*0.2*u_orbit, sin(a+3.6)*r*0.85);

  float fi = u_focusIndex;
  if(abs(fi - float(i)) < 0.5){
    p = mix(p, vec3(0.0, 0.0, 0.0), u_focusAmt*0.85);
  } else if(fi >= 0.0){
    p = mix(p, p*2.4, u_focusAmt);
  }
  return p;
}

float agentRadius(int i){
  float base = 0.34;
  if(abs(u_focusIndex - float(i)) < 0.5){
    return mix(base, 0.62, u_focusAmt);
  }
  if(u_focusIndex >= 0.0){
    return mix(base, 0.18, u_focusAmt);
  }
  return base;
}

vec3 agentColor(int i){
  if(i==0) return SALES;
  if(i==1) return SUPPORT;
  if(i==2) return OPS;
  return RESEARCH;
}

vec2 map(vec3 p, out vec3 emitColor){
  emitColor = vec3(0.0);
  float d = 1e9;
  for(int i=0;i<4;i++){
    vec3 ap = agentPos(i);
    float dr = sdSphere(p-ap, agentRadius(i));
    float pulse = 0.04 * sin(u_time*1.5 + float(i)*1.1);
    dr -= pulse;
    float k = 0.45;
    d = smin(d, dr, k);
    float e = exp(-length(p-ap)*1.6);
    emitColor += agentColor(i) * e;
  }
  float seed = sdSphere(p, 0.18 + 0.02*sin(u_time*2.0));
  float seedBlend = smoothstep(0.0, 1.0, max(u_intro, u_outro));
  d = smin(d, seed, mix(0.05, 0.4, seedBlend));
  emitColor += vec3(1.0,0.55,0.3) * exp(-length(p)*2.2) * (0.5 + seedBlend*0.6);
  return vec2(d, 0.0);
}

vec3 calcNormal(vec3 p){
  const vec2 e = vec2(0.001, 0.0);
  vec3 dummy;
  return normalize(vec3(
    map(p+e.xyy, dummy).x - map(p-e.xyy, dummy).x,
    map(p+e.yxy, dummy).x - map(p-e.yxy, dummy).x,
    map(p+e.yyx, dummy).x - map(p-e.yyx, dummy).x
  ));
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;

  float camDist = mix(2.5, 4.2, u_orbit) - u_focusAmt*1.4;
  camDist = mix(2.0, camDist, u_intro);
  camDist = mix(camDist, 2.2, u_outro);
  float yaw = u_scroll * 6.2831853 * 0.6 + u_time*0.04;
  float pitch = sin(u_scroll*3.14159 + 0.5)*0.25 - 0.1;

  vec3 ro = vec3(sin(yaw)*camDist, sin(pitch)*camDist*0.45, cos(yaw)*camDist);
  vec3 ta = vec3(0.0);
  vec3 fwd = normalize(ta - ro);
  vec3 right = normalize(cross(fwd, vec3(0,1,0)));
  vec3 up = cross(right, fwd);
  float fov = 1.4;
  vec3 rd = normalize(fwd + uv.x*right*fov + uv.y*up*fov);

  float t = 0.0;
  vec3 emitTotal = vec3(0.0);
  float hit = 0.0;
  vec3 hitP = vec3(0.0);
  for(int i=0;i<88;i++){
    vec3 p = ro + rd*t;
    vec3 e;
    float d = map(p, e).x;
    emitTotal += e * 0.012;
    if(d < 0.001){ hit = 1.0; hitP = p; break; }
    if(t > 16.0) break;
    t += d * 0.85;
  }

  vec3 col = vec3(0.0);

  if(hit > 0.5){
    vec3 n = calcNormal(hitP);
    vec3 e;
    map(hitP, e);
    vec3 lightDir = normalize(vec3(0.6, 0.8, 0.4));
    float diff = max(dot(n, lightDir), 0.0);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.5);
    vec3 base = e * 1.4 + vec3(0.04,0.04,0.06);
    col = base * (0.4 + diff*0.6) + e * fres * 1.8;
    col += e * 0.6 * pow(1.0 - max(dot(n,-rd),0.0), 4.0);
  } else {
    float bg = fbm(rd*1.2 + vec3(u_time*0.05, 0.0, u_time*0.03));
    col = vec3(0.02,0.02,0.04) + bg*0.04;
    float horiz = 1.0 - abs(rd.y);
    col += vec3(1.0,0.4,0.15) * pow(horiz, 8.0) * 0.18;
  }

  col += emitTotal * 1.6;
  float vig = smoothstep(1.4, 0.3, length(uv));
  col *= vig;
  float g = (hash(vec3(gl_FragCoord.xy, fract(u_time))) - 0.5) * 0.025;
  col += g;
  col = col / (col + vec3(1.0));
  col = pow(col, vec3(0.85));
  col = mix(col, col * vec3(1.05, 0.95, 0.85) + vec3(0.04,0.02,0.0), u_outro*0.4);

  outColor = vec4(col, 1.0);
}`;

function smoothstepNum(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export type StageProps = {
  /** how many vh the experience occupies — used to map scrollY → 0..1 progress */
  experienceVh?: number;
  /** called every frame with progress 0..1 and active act 0..6 */
  onProgress?: (p: number, act: number) => void;
};

export default function Stage({ experienceVh = 700, onProgress }: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, "a_pos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(prog));

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      scroll: gl.getUniformLocation(prog, "u_scroll"),
      focusIndex: gl.getUniformLocation(prog, "u_focusIndex"),
      focusAmt: gl.getUniformLocation(prog, "u_focusAmt"),
      orbit: gl.getUniformLocation(prog, "u_orbit"),
      intro: gl.getUniformLocation(prog, "u_intro"),
      outro: gl.getUniformLocation(prog, "u_outro"),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const ACTS = 7;
    const SEGS: [number, number][] = [
      [0.00, 0.14],
      [0.14, 0.28],
      [0.28, 0.43],
      [0.43, 0.58],
      [0.58, 0.72],
      [0.72, 0.86],
      [0.86, 1.00],
    ];

    let scroll = 0;
    let scrollTarget = 0;
    let active = true;
    let lastAct = -1;

    const updateScrollTarget = () => {
      const max = (experienceVh / 100) * window.innerHeight;
      const y = Math.min(window.scrollY, max);
      scrollTarget = max > 0 ? y / max : 0;
      // hide canvas + pause when fully past the experience
      const past = window.scrollY > max + window.innerHeight * 0.5;
      if (past && active) {
        active = false;
        canvas.style.opacity = "0";
      } else if (!past && !active) {
        active = true;
        canvas.style.opacity = "1";
      }
    };
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    updateScrollTarget();

    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      scroll += (scrollTarget - scroll) * 0.08;
      const time = (performance.now() - t0) / 1000;
      const act = Math.min(ACTS - 1, Math.floor(scroll * ACTS + 0.0001));
      if (act !== lastAct) {
        lastAct = act;
        onProgressRef.current?.(scroll, act);
      } else {
        onProgressRef.current?.(scroll, act);
      }

      const intro = 1 - smoothstepNum(0.02, 0.14, scroll);
      const outro = smoothstepNum(0.86, 0.99, scroll);
      const orbit = smoothstepNum(0.05, 0.20, scroll) * (1 - smoothstepNum(0.85, 0.99, scroll));

      let focusIndex = -1;
      let focusAmt = 0;
      for (let i = 2; i <= 5; i++) {
        const [a, b] = SEGS[i];
        if (scroll >= a && scroll <= b) {
          focusIndex = i - 2;
          const local = (scroll - a) / (b - a);
          focusAmt = Math.min(1, Math.sin(Math.max(0, Math.min(1, local)) * Math.PI) * 1.6);
          break;
        }
      }

      if (active) {
        gl.useProgram(prog);
        gl.bindVertexArray(vao);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform1f(u.time, time);
        gl.uniform1f(u.scroll, scroll);
        gl.uniform1f(u.focusIndex, focusIndex);
        gl.uniform1f(u.focusAmt, focusAmt);
        gl.uniform1f(u.orbit, orbit);
        gl.uniform1f(u.intro, intro);
        gl.uniform1f(u.outro, outro);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScrollTarget);
    };
  }, [experienceVh]);

  return (
    <div id="stage" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
