import { useState, useRef, useEffect } from 'react';
import './App.css';
const vertexCode = require('./shaders/vertex.glsl');
const mandelCode = require('./shaders/mandel.glsl');

function loadMandelbrot(canvas) {
    let gl = canvas.getContext('experimental-webgl');
    
    let vertices = [
        -1.0,1.0,0.0,
        -1.0,-1.0,0.0,
        1.0,-1.0,0.0, 
        1.0,1.0,0.0,
    ];
    let indices = [3,2,1,3,1,0];
    let zoom = [-0.6,0.0,1.0];
    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    let vertCode = vertexCode;
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    
    let fragCode = mandelCode;
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    
    let _zoom = gl.getUniformLocation(shaderProgram, "zoom");
    let _aspect = gl.getUniformLocation(shaderProgram, "aspect");
    let _coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(_coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(_coord);
    
    gl.useProgram(shaderProgram);
    
    return (opts) => {
        gl.uniform3fv(_zoom, zoom, 3);
        gl.uniform1f(_aspect, canvas.width/canvas.height);
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
}

function Display() {
    const [scale, setScale] = useState({ x: 0, y: 0 });
    const canvas = useRef(null);
    const render = useRef(null);

    const resized = () => {
        canvas.current.width = canvas.current.clientWidth;
        canvas.current.height = canvas.current.clientHeight;
        setScale({ x: canvas.current.clientWidth, y: canvas.current.clientHeight });
    };

    useEffect(() => resized(), []);

    useEffect(() => {
        render.current = loadMandelbrot(canvas.current)
        window.addEventListener("resize", resized);
        return () => window.removeEventListener("resize", resized);
    });

    useEffect(() => {
        let opts = {};
        if (render.current) render.current(opts);
    }, [scale]);

    return <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />;
}

export default Display;
