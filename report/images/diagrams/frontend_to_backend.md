flowchart TD
    A[Frontend Angular Server]
    A--HTTP Requests-->B[Axum HTTP Server]
    B--Writes/Reads Data-->C[MongoDB Database]
