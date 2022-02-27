import { useState, useRef, useEffect } from 'react';
import './App.css';

function loadMandelbrot(canvas) {
    let gl = canvas.getContext('experimental-webgl');
    
    let vertices = [
        -1.0,1.0,0.0,
        -1.0,-1.0,0.0,
        1.0,-1.0,0.0, 
        1.0,1.0,0.0,
    ];
    let indices = [3,2,1,3,1,0];
    let zoom = [0.0,0.0,2.0];
    let vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(zVertices), gl.STATIC_DRAW);
    let index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    let vertCode =
        'attribute vec3 coordinates;' +
        'varying vec3 vCoordinates;' +
        
        'void main(void) {' +
            'gl_Position = vec4(coordinates, 1.0);' +
            'vCoordinates = coordinates;' +
        '}';
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    
    let fragCode =
        'precision highp float;' +
        'varying vec3 vCoordinates;' +
        'uniform vec3 zoom;' +
        'void main(void) {' +
            'float x = vCoordinates.x*zoom.z+zoom.x;' +
            'float y = vCoordinates.y*zoom.z+zoom.y;' +
            'float rPart = 0.0;' +
            'float iPart = 0.0;' +
            'float trPart;' +
            'float tiPart;' +
            'float alpha = -1.0;' +
            'for (float i = 0.0; i < 8000.0; i++) {' +
                'trPart = rPart;' +
                'tiPart = iPart;' +
                'rPart =trPart*trPart-tiPart*tiPart+x;' +
                'iPart = 2.0*trPart*tiPart+y;' +
                'if (rPart*rPart+iPart*iPart > 4.0) {' +
                    'alpha = i;' +
                    'break;' +
                '}' +
            '}' +
            'if (alpha == -1.0)' +
                '{gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}' +
            'else' +
                '{gl_FragColor = vec4(abs(mod(alpha/100.0, 2.0)-1.0), abs(mod(alpha/160.0+1.3, 2.0)-1.0), abs(mod(alpha/180.0+1.7, 2.0)-1.0), 1.0);}' +
        '}';
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    
    let _zoom = gl.getUniformLocation(shaderProgram, "zoom");
    let coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.useProgram(shaderProgram);
    
    return (opts) => {
        gl.uniform3fv(_zoom, zoom, 3);
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
    let render = undefined;

    const resized = () => {
        canvas.current.width = canvas.current.clientWidth;
        canvas.current.height = canvas.current.clientHeight;
        setScale({ x: canvas.current.clientWidth, y: canvas.current.clientHeight });
    };

    useEffect(() => resized(), []);

    useEffect(() => {
        render = loadMandelbrot(canvas.current)
        window.addEventListener("resize", resized);
        return () => window.removeEventListener("resize", resized);
    });

    useEffect(() => {
        let opts = {};
        if (render) render(opts);
    }, [scale]);

    return <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />;
}

export default Display;
