import { nanoid } from "nanoid";

export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const gscriptRegistration = config.gsheetReg;
  const gscriptQualifiers = config.gsheetQf;
  const gsheetRegistration: any = await $fetch(gscriptRegistration, { method: "GET" });
  const gsheetQualifiers: any = await $fetch(gscriptQualifiers, { method: "GET" });

  // const { payload } = await readBody(event);
  const kv = await hubKV().get<any[]>("sgl2-update-log");

  if (gsheetRegistration.status !== "success") {
    throw createError({
      statusCode: 500,
      message: "Error fetching SGL2 entries",
    });
  };

  if (gsheetQualifiers.status !== "success") {
    throw createError({
      statusCode: 500,
      message: "Error fetching SGL2 entries",
    });
  };

  const gdataRegistration = [];
  for (let i = 0; i < gsheetRegistration.data.IGN.length; i++) {
    if (gsheetRegistration.data.IGN[i] === "") continue;
    const m = {
      key: nanoid(8),
      player: gsheetRegistration.data.IGN[i],
      endings: getEndingsR(i, gsheetRegistration.data),
      checked: gsheetRegistration.data.CHECKED[i],
      valid: gsheetRegistration.data.VALID[i],
    };
    gdataRegistration.push(m);
  };

  const gdataQualifiers = [];
  for (let i = 0; i < gsheetQualifiers.data.IGN.length; i++) {
    if (gsheetQualifiers.data.IGN[i] === "") continue;
    const m = {
      key: nanoid(8),
      player: gsheetQualifiers.data.IGN[i],
      run1: {
        endings: getEndingsQ1(i, gsheetQualifiers.data),
        score: gsheetQualifiers.data.RUN1_SCORE[i],
        time: gsheetQualifiers.data.RUN1_TIME[i],
        video: gsheetQualifiers.data.RUN1_VIDEO[i],
      },
      run2: {
        endings: getEndingsQ2(i, gsheetQualifiers.data),
        score: gsheetQualifiers.data.RUN2_SCORE[i],
        time: gsheetQualifiers.data.RUN2_TIME[i],
        video: gsheetQualifiers.data.RUN2_VIDEIO[i],
      },
      total: gsheetQualifiers.data.TOTAL_SCORE[i],
    };
    gdataQualifiers.push(m);
  };

  const update = {
    time: new Date(Date.now()),
    // scheduledTime: payload && Object.keys(payload).length > 0 ? new Date(payload.scheduledTime) : "N/A",
    scheduledTime: "N/A",
    regLength: gdataRegistration.length,
    qfLength: gdataQualifiers.length,
  };

  if (kv && kv.length > 500)
    kv.shift();

  if (!kv)
    await hubKV().set("sgl2-update-log", [ update ]);
  else
    await hubKV().set("sgl2-update-log", [ ...kv, update ]);

  await hubKV().set("sgl2-registration", gdataRegistration);
  await hubKV().set("sgl2-live-qualifiers", gdataQualifiers);
  return "success";
});

function getEndingsR(index: number, data: any) {
  const endingsR = [];
  switch (data._ED1[index]) {
    case "N":
      endingsR.push("ed1");
      break;
    case "A":
      endingsR.push("ed1alt");
      break;
    case "":
    default:
      break;
  }
  switch (data._ED2[index]) {
    case "N":
      endingsR.push("ed2");
      break;
    case "A":
      endingsR.push("ed2alt");
      break;
    case "":
    default:
      break;
  }
  switch (data._ED3[index]) {
    case "N":
      endingsR.push("ed3");
      break;
    case "A":
      endingsR.push("ed3alt");
      break;
    case "":
    default:
      break;
  }
  switch (data._ED4[index]) {
    case "N":
      endingsR.push("ed4");
      break;
    case "A":
      endingsR.push("ed4alt");
      break;
    case "":
    default:
      break;
  }
  return endingsR;
}

function getEndingsQ1(index: number, data: any) {
  const endings1 = [];
  switch (data.RUN1_ED1[index]) {
    case "N":
      endings1.push("ed1");
      break;
    case "A":
      endings1.push("ed1alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN1_ED2[index]) {
    case "N":
      endings1.push("ed2");
      break;
    case "A":
      endings1.push("ed2alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN1_ED3[index]) {
    case "N":
      endings1.push("ed3");
      break;
    case "A":
      endings1.push("ed3alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN1_ED4[index]) {
    case "N":
      endings1.push("ed4");
      break;
    case "A":
      endings1.push("ed4alt");
      break;
    case "":
    default:
      break;
  }
  return endings1;
}

function getEndingsQ2(index: number, data: any) {
  const endings2 = [];
  switch (data.RUN2_ED1[index]) {
    case "N":
      endings2.push("ed1");
      break;
    case "A":
      endings2.push("ed1alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN2_ED2[index]) {
    case "N":
      endings2.push("ed2");
      break;
    case "A":
      endings2.push("ed2alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN2_ED3[index]) {
    case "N":
      endings2.push("ed3");
      break;
    case "A":
      endings2.push("ed3alt");
      break;
    case "":
    default:
      break;
  }
  switch (data.RUN2_ED4[index]) {
    case "N":
      endings2.push("ed4");
      break;
    case "A":
      endings2.push("ed4alt");
      break;
    case "":
    default:
      break;
  }
  return endings2;
}
