#version 330

in vec4 gl_FragCoord;
out vec4 FinalColor;

uniform vec2 resolution;
uniform float zoomFactor;
uniform float time;
uniform vec2 offset;
uniform int power;

#define MAX_ITERATIONS 1000

float iterationsFunction(){
    vec2 c, z;
    c.x = (gl_FragCoord.x / resolution.x - 0.5) * zoomFactor + offset.x;
    c.y = (gl_FragCoord.y / resolution.y - 0.5) * zoomFactor + offset.y;

    //initial complex number
    z = c;
    float iterations = 0;
    float const_real = c.x;
    float const_imag = c.y;

    while(iterations < MAX_ITERATIONS){
        //argument of the complex number
        float argument = atan(z.y, z.x);
        float magnitude = sqrt(z.x*z.x + z.y*z.y);
        float newArg = argument * power;
        float newMag = pow(magnitude, power);
        float realComp = newMag * cos(newArg) + const_real;
        float imagComp = newMag * sin(newArg) + const_imag;

        z.x = realComp;
        z.y = imagComp;

        float zMagnitude = realComp*realComp + imagComp*imagComp;
        if(zMagnitude > 4.0)
            break;
        
        iterations++;
    }
    return iterations;
}

vec4 returnColor(){
    float iter = iterationsFunction();    
    if(iter == MAX_ITERATIONS)
        return vec4(0.3, 1.0, 1.0, 1.0);
    
    float iterations = float(iter) / MAX_ITERATIONS;
    return vec4(0.2f, sin(iterations * time) * 10, 0.5f, 1.0f);

}

void main(){
    FinalColor = returnColor();
}