attribute vec3 coordinates;
varying vec3 vCoordinates;
uniform float aspect;
        
void main(void) {
    gl_Position = vec4(coordinates, 1.0);
    vCoordinates = coordinates;
    vCoordinates.x *= aspect;
}