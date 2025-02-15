# Compiler and flags
CXX = g++
CXXFLAGS = -Wall -Wextra -std=c++17 -Iinclude

# raylib config (assuming it's installed system-wide)
LIBS = -lraylib -lm -ldl -lpthread -lGL

# Directories
OBJ_DIR = obj
BIN_DIR = bin

# Files
TARGET = $(BIN_DIR)/my_project
SRCS = $(wildcard *.cpp)
OBJS = $(patsubst $(SRC_DIR)/%.cpp, $(OBJ_DIR)/%.o, $(SRCS))

# Default target
all: $(TARGET)

# Build target executable
$(TARGET): $(OBJS)
	@mkdir -p $(BIN_DIR)
	$(CXX) $(CXXFLAGS) $^ -o $@ $(LIBS)

# Compile source files to object files
$(OBJ_DIR)/%.o: %.cpp
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)

# Run the project
run: all
	./$(TARGET)

# Phony targets (not actual files)
.PHONY: all clean run