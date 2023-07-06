const nats = require("node-nats-streaming");

const NATS_CLUSTER_ID = "insight360"; // "test-cluster"
const NATS_CLIENT_ID = "notification-service";
const NATS_URL = "nats://localhost:4222";
const CHANNEL = "CHANNEL";

let NUMBER = 1;

// NATS Streaming 클라이언트 생성
const stan = nats.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, {
  url: NATS_URL, // NATS Streaming 서버의 URL
});

// 연결이 성공한 경우 이벤트 핸들러
stan.on("connect", () => {
  console.log("Connected to NATS Streaming");

  // 채널 구독
  const subscription = stan.subscribe(CHANNEL);

  // 메시지 도착 핸들러
  subscription.on("message", (msg) => {
    console.log("Received a message:", msg.getData());
  });
});

// 연결에 실패한 경우 이벤트 핸들러
stan.on("error", (err) => {
  console.error("Failed to connect to NATS Streaming:", err);
});

// NATS Streaming 연결 해제
process.on("SIGINT", () => {
  stan.close();
  process.exit();
});

setInterval(() => {
  // 메시지 발행
  stan.publish(CHANNEL, `Hello, NATS Streaming!, ${NUMBER}`);
  NUMBER++;
}, 3000);
