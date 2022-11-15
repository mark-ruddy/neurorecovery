FROM docker.io/library/rust:1.60

WORKDIR app
COPY . .

#RUN rustup toolchain install nightly-x86_64-unknown-linux-gnu && \
RUN cargo build --release

# Expose Axum server
EXPOSE 8080

# Set MongoDB Password
ARG NEURORECOVERY_MONGODB_PASS
ENV NEURORECOVERY_MONGODB_PASS $NEURORECOVERY_MONGODB_PASS

ENTRYPOINT ["bash", "-c", "source /root/.bashrc && ./target/release/backend --addr 0.0.0.0:8080 --mongodb-url mongodb://10.43.252.173:27017 --mongodb-username root --mongodb-name neurorecovery"]
