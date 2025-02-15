#include <raylib.h>
#include <cmath>

const int WIDTH = 1000, HEIGHT = 1000;
int targetFPS = 120;

int main(){

    InitWindow(WIDTH, HEIGHT, "Fractals");
    SetTargetFPS(targetFPS);

    Shader baseShader = LoadShader(0, "Shaders/baseShaderMultibrot.frag");
    int timeLoc = GetShaderLocation(baseShader, "time");
    int zoomLoc = GetShaderLocation(baseShader, "zoomFactor");
    int resolutionLoc = GetShaderLocation(baseShader, "resolution");
    int offsetLoc = GetShaderLocation(baseShader, "offset");
    int complexNumLoc = GetShaderLocation(baseShader, "complexNum");
    Vector2 resolution = {(float)WIDTH, (float)HEIGHT };
    float xOffset = 0.0f;
    float yOffset = 0.0f;
    Vector2 complexNumUniform = {0.0f, 0.0f};

    float zoomUni = 1.0f;
    float dragStep = 0.01f;
    int power = 2;

    SetShaderValue(baseShader, resolutionLoc, &resolution, SHADER_UNIFORM_VEC2);

    RenderTexture2D targetTexture = LoadRenderTexture(WIDTH, HEIGHT);
    Rectangle texturedRec = {0, 0, WIDTH, HEIGHT};
    
    while (!WindowShouldClose()) {

        dragStep = zoomUni * 0.01f;;

        float time = GetTime();
        Vector2 offsetUniform = {xOffset, yOffset};
        SetShaderValue(baseShader, offsetLoc, &offsetUniform, SHADER_UNIFORM_VEC2);
        SetShaderValue(baseShader, timeLoc, &time, SHADER_UNIFORM_FLOAT);
        SetShaderValue(baseShader, zoomLoc, &zoomUni, SHADER_UNIFORM_FLOAT);
        SetShaderValue(baseShader, complexNumLoc, &complexNumUniform, SHADER_UNIFORM_VEC2);
        SetShaderValue(baseShader, GetShaderLocation(baseShader, "power"), &power, SHADER_UNIFORM_INT);

        // BeginTextureMode(targetTexture);
        //     ClearBackground(BLANK);
        //     DrawTextureRec(targetTexture.texture, texturedRec, (Vector2){0.0f, 0.0f}, WHITE);
        // EndTextureMode();

        BeginDrawing();
            ClearBackground(RAYWHITE);
            BeginShaderMode(baseShader);
                DrawTextureRec(targetTexture.texture, texturedRec, (Vector2){0.0f, 0.0f}, WHITE);
            EndShaderMode();
        EndDrawing();

        // Controlling Zoom Factor and Power(For multibrot)
        if(IsKeyDown(KEY_UP))
            zoomUni -= 0.005f;
        if(IsKeyDown(KEY_DOWN))
            zoomUni += 0.005f;
        if(zoomUni < 0.0f)
            zoomUni = 0.0f;
        if(IsKeyReleased(KEY_RIGHT))
            power++;
        if(IsKeyReleased(KEY_LEFT))
            power--;

        //Clamping the power variable
        if(power < 2)
            power = 2;

        // Controlling the complex number given as the input to the shader
        if(IsKeyDown(KEY_KP_8))
            complexNumUniform.y += 0.001f;
        if(IsKeyDown(KEY_KP_2))
            complexNumUniform.y -= 0.001f;
        if(IsKeyDown(KEY_KP_4))
            complexNumUniform.x -= 0.001f;
        if(IsKeyDown(KEY_KP_6))
            complexNumUniform.x += 0.001f;

        // Moving Around
        if(IsKeyDown(KEY_W))
            yOffset += dragStep;
        if(IsKeyDown(KEY_S))
            yOffset -= dragStep;
        if(IsKeyDown(KEY_A))
            xOffset -= dragStep;
        if(IsKeyDown(KEY_D))
            xOffset += dragStep;
    }
    CloseWindow();
}