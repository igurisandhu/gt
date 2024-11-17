// redis common methods to read and write data to redis
import redis from "redis";

const client = redis.createClient();

client.on("error", (err) => {
  console.log("Error " + err);
});

export const setRedisData = (key: string | number, value: string | number) => {
  client.set(String(key), String(value), redis.print);
};

export const getRedisData = (key: string | number): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.get(String(key), (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply || "");
    });
  });
};

export const deleteRedisData = (key: string | number) => {
  client.del(String(key), redis.print);
};

export const setRedisDataWithExpiry = (
  key: string | number,
  value: string | number,
  expiry: number,
) => {
  client.set(String(key), String(value), "EX", expiry, redis.print);
};
