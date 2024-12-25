FROM debian:bookworm-slim AS builder
ARG TARGETARCH
WORKDIR /usr/app
COPY ./target/x86_64-unknown-linux-gnu/release/openthedoor-cli /usr/app/openthedoor-cli-amd64
COPY ./target/aarch64-unknown-linux-gnu/release/openthedoor-cli /usr/app/openthedoor-cli-arm64
RUN if [ "$TARGETARCH" = "amd64" ]; then \
        cp /usr/app/openthedoor-cli-amd64 /usr/app/openthedoor-cli; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        cp /usr/app/openthedoor-cli-arm64 /usr/app/openthedoor-cli; \
    fi

FROM debian:bookworm-slim
WORKDIR /usr/app
ENV PATH="/usr/app:${PATH}"
COPY --from=builder /usr/app/openthedoor-cli /usr/app/openthedoor-cli
COPY ./config /usr/app/config

ENTRYPOINT ["/usr/app/openthedoor-cli"]
