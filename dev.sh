#!/bin/bash

# Name of the tmux session
SESSION="tabletop-dev"

# Start a new tmux session
tmux new-session -d -s $SESSION

# Split the window into panes
tmux split-window -h
tmux split-window -v
tmux select-pane -t 0
tmux split-window -v
tmux select-pane -t 2
tmux split-window -v

# Arrange the layout
tmux select-layout tiled

# Start processes in each pane
# Pane 0: npm run dev (Vite development server)
tmux send-keys -t 0 'npm run dev' C-m

# Pane 1: npm run check:watch (TypeScript checking)
tmux send-keys -t 1 'npm run check:watch' C-m

# Pane 2: npm run test:watch (Vitest)
tmux send-keys -t 2 'npm run test:watch' C-m

# Pane 3: npm run storybook
tmux send-keys -t 3 'npm run storybook -- --no-open' C-m

# Pane 4: npx convex dev (Convex development server)
tmux send-keys -t 4 'npx convex dev' C-m

# Attach to the session
tmux attach-session -t $SESSION
