varying vec3 vertexNormal;

void main() {    
    // Change the first value here to adjust the thickness of the atmosphere.
    float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);

    // Change the first 3 values (0 -> 1) to change the atmosphere color.
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;

}