import { upload_csv } from "@ctrls/upload/upload_csv.ts";
import { upload_document } from "@ctrls/upload/upload_document.ts";
import {
  deviceValidationHeader,
  userValidationHeader,
} from "@ctrls/upload/validation.ts";
import { RouterContext } from "@oak";
import { faildRes, httpServer, jsonDispatch } from "@utils";

import * as deviceControllers from "@ctrls/device/device.ts";
import * as usb_keys from "@ctrls/device/usb_key.ts";
import * as logs from "@ctrls/log/log.ts";
import * as ip_address from "@ctrls/network/ip_address.ts";
import * as network_type from "@ctrls/network/network_type.ts";
import * as document from "@ctrls/profile/document.ts";
import * as document_history from "@ctrls/profile/document_history.ts";
import * as department from "@ctrls/staff/department.ts";
import * as userControllers from "@ctrls/staff/user.ts";

const { upload_devices, ...device } = deviceControllers;
const { upload_users, ...user } = userControllers;

const dispatch = jsonDispatch({
  ...usb_keys,
  ...network_type,
  ...department,
  ...user,
  ...ip_address,
  ...logs,
  ...device,
  ...document,
  ...document_history,
});

const router = httpServer({ port: 8083 });

router.get("/static/:filename", async (ctx, next) => {
  try {
    await ctx.send({
      root: `.`,
    });
  } catch {
    await next();
  }
});

router.post("/phl", async (ctx: RouterContext<"/phl">) => {
  const data = await ctx.request.body().value;

  const client = {
    addr: {
      hostname: ctx.request.ip,
    },
  };

  ctx.response.body = await dispatch(await data, client).catch((err) =>
    faildRes({
      errcode: 1004,
      errmsg: err,
    })
  );
});

// 上传文件
router.post("/upload/static", async (ctx: RouterContext<"/upload/static">) => {
  const res = await upload_document(ctx).catch((err) => {
    return faildRes({
      errcode: 1004,
      errmsg: err,
    });
  });

  ctx.response.body = res;
});

// 上传设备
router.post(
  "/upload/devices",
  async (ctx: RouterContext<"/upload/devices">) => {
    const res = await upload_csv(
      ctx,
      deviceValidationHeader,
      upload_devices,
    ).catch((err) => {
      return faildRes({
        errcode: 1004,
        errmsg: err,
      });
    });

    ctx.response.body = res;
  },
);

//上传用户
router.post("/upload/users", async (ctx: RouterContext<"/upload/users">) => {
  const res = await upload_csv(ctx, userValidationHeader, upload_users).catch(
    (err) => {
      return faildRes({
        errcode: 1004,
        errmsg: err,
      });
    },
  );

  ctx.response.body = res;
});
