# Shared sources

Going Public item 6. Some shared modules live in **private** repositories. A public repo can't
depend on a private one, so anything it needs is **copied** into `/shared` and listed here.

## Rules for copies

1. Copy only what this repo actually uses.
2. Don't edit copies in place. Change the source, then re-copy and update the date.
3. When a source module is made public, delete the copy and depend on the public module instead;
   remove its row here.

## Copied pieces

| Piece    | Copied to | Source (repo / path) | Source commit | Date copied |
|----------|-----------|----------------------|---------------|-------------|
| *(none)* |           |                      |               |             |
