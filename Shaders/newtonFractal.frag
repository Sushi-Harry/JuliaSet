#version 330

in vec4 gl_FragCoord;
out vec4 FinalColor;

uniform vec2 resolution;
uniform vec2 offset;
uniform float zoomFactor;

#define MAX_STEPS 100
const int MAX_ITERATIONS = 100;
vec2 roots[3] = vec2[]( vec2(1.0, 0.0), vec2(-0.5, sqrt(3.0) / 2.0), vec2(-0.5, -sqrt(3.0) / 2.0) );
vec3 colors[3] = vec3[]( vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0) );

vec2 complexPower(vec2 complexNumber, float power){
    vec2 zTemp = complexNumber;
    float zMag = length(zTemp);
    float zArg = atan(zTemp.y, zTemp.x);

    // Applying transformations to calculate nth power
    zArg *= power;
    zMag = pow(zMag, power);

    // Conversion to cartesian form
    zTemp.x = zMag * cos(zArg);
    zTemp.y = zMag * sin(zArg);
    return zTemp;
}

// Derivatibe Function
vec2 derivativeFunction(vec2 complexNumber, float complexNumPower){
    vec2 derivativeZ = complexNumPower * complexPower(complexNumber, (complexNumPower-1.0));
    return derivativeZ;
}

// Newton Fractal Function
vec2 newtonFunction(vec2 z){
    return complexPower(z, 3.0) - vec2(1.0, 0.0);
}

// Complex Number Division
vec2 complexDivide(vec2 z1, vec2 z2){
    float x = ((z1.x*z2.x) + (z1.y*z2.y)) / dot(z2,z2);
    float y = ((z1.y*z2.x) - (z1.x*z2.y)) / dot(z2,z2);
    return vec2(x, y);
}

// Returning Color Based on Iterations
vec3 iterationsFunction(){
    vec2 uv;
    uv.x = (gl_FragCoord.x / resolution.x - 0.5) * zoomFactor + offset.x;
    uv.y = (gl_FragCoord.y / resolution.y - 0.5) * zoomFactor + offset.y;
    vec2 complexZ = uv;
    for(int iter = 0; iter < MAX_ITERATIONS; iter++){
        complexZ -= complexDivide(newtonFunction(complexZ), derivativeFunction(complexZ, 3.0));
        float tolerance = 0.000001;

        for(int i = 0; i < 3; i++){
            vec2 diff = complexZ - roots[i];
            if(abs(diff.x) < tolerance && abs(diff.y) < tolerance){
                return colors[i];
            }
        }
    }
    return vec3(0.0);
}

void main(){
    FinalColor = vec4(iterationsFunction(), 1.0);
}
