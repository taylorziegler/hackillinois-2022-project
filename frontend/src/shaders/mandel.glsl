precision highp float;
varying vec3 vCoordinates;
uniform vec3 zoom;

void main(void) {
    float x = vCoordinates.x*zoom.z+zoom.x;
    float y = vCoordinates.y*zoom.z+zoom.y;
    float rPart = 0.0;
    float iPart = 0.0;
    float trPart;
    float tiPart;
    float alpha = -1.0;
    for (float i = 0.0; i < 8000.0; i++) {
        trPart = rPart;
        tiPart = iPart;
        rPart =trPart*trPart-tiPart*tiPart+x;
        iPart = 2.0*trPart*tiPart+y;
        if (rPart*rPart+iPart*iPart > 4.0) {
            alpha = i;
            break;
        }
    }
    if (alpha == -1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(
            abs(mod(alpha/100.0, 2.0)-1.0),
            abs(mod(alpha/160.0+1.3, 2.0)-1.0),
            abs(mod(alpha/180.0+1.7, 2.0)-1.0), 1.0);
    }
}