const ipv4Regex =
  /^((25[0-5]|2[0-4]\d|[10]?\d?\d)\.){3}(25[0-5]|2[0-4]\d|[10]?\d?\d)$/;
const ipv6Regex =
  /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

const macRegex = /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/;

export const macIsFormat = (mac: string) => {
  return macRegex.test(mac);
};

// 测试是否是ipv4的地址格式
export const ipIsV4Format = (ip: string) => {
  return ipv4Regex.test(ip);
};

// 测试是否是ipv6的地址格式
export const ipIsV6Format = (ip: string) => {
  return ipv6Regex.test(ip);
};

// 转成数字
export const ipToLong = (ip: string) => {
  let ipl = 0;
  ip.split(".").forEach((octet) => {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return ipl >>> 0;
};

// 转成字符串
export const ipFromLong = (ipl: number) => {
  return `${ipl >>> 24}.${(ipl >> 16) & 255}.${(ipl >> 8) & 255}.${ipl & 255}`;
};

// 是否私有地址
export const ipIsPrivate = (addr: string) => {
  return (
    /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(
      addr,
    ) ||
    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^f[cd][0-9a-f]{2}:/i.test(addr) ||
    /^fe80:/i.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr)
  );
};

// 是否公有地址
export const ipIsPublic = (addr: string) => {
  return !ipIsPrivate(addr);
};

export const ipToBuffer = (ip: string) => {
  if (ipIsV4Format(ip)) {
    // const buffer = new ArrayBuffer(4)
    return ip.split(/\./g).map((byte: string) => {
      return parseInt(byte, 10) & 0xff;
    });
  }

  // else if (ipIsV6Format(ip)) {
  // const sections = ip.split(':', 8)

  // let i
  // for (i = 0; i < sections.length; i++) {
  // 	const isv4 = ipIsV4Format(sections[i])
  // 	let v4Buffer

  // 	if (isv4) {
  // 		v4Buffer = ipToBuffer(sections[i])
  // 		sections[i] = v4Buffer.slice(0, 2).toString('hex')
  // 	}

  // 	if (v4Buffer && ++i < 8) {
  // 		sections.splice(i, 0, v4Buffer.slice(2, 4).toString('hex'))
  // 	}
  // }

  // if (sections[0] === '') {
  // 	while (sections.length < 8) sections.unshift('0')
  // } else if (sections[sections.length - 1] === '') {
  // 	while (sections.length < 8) sections.push('0')
  // } else if (sections.length < 8) {
  // 	for (i = 0; i < sections.length && sections[i] !== ''; i++);
  // 	const argv = [i, 1]
  // 	for (i = 9 - sections.length; i > 0; i--) {
  // 		argv.push(0)
  // 	}
  // 	sections.splice(argv[0], argv[1])
  // }

  // result = new ArrayBuffer(16)
  // for (i = 0; i < sections.length; i++) {
  // 	const word = parseInt(sections[i], 16)
  // 	result[i] = (word >> 8) & 0xff
  // 	result[i] = word & 0xff
  // }
  // // }

  // if (!result) {
  throw Error(`Invalid ip address: ${ip}`);
  // }

  // return result
};

export const ipToString = (buff: number[]) => {
  if (buff.length === 4) {
    // IPv4
    return buff.join(".");
  } else if (buff.length === 16) {
    // IPv6
    const result: string[] = [];

    for (let i = 0; i < buff.length; i += 2) {
      result.push(buff[i].toString(16));
    }

    return result
      .join(":")
      .replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3")
      .replace(/:{3,4}/, "::");
  }
};

//从0-32中获取IP字符串
export const ipFromPrefixLen = (prefixlen: number) => {
  const family = prefixlen > 32 ? "ipv6" : "ipv4";

  const len = family === "ipv6" ? 16 : 4;

  const buff = new Array(len).fill(0);

  for (let i = 0, n = buff.length; i < n; ++i) {
    let bits = 8;
    if (prefixlen < 8) {
      bits = prefixlen;
    }
    prefixlen -= bits;

    buff[i] = ~(0xff >> bits) & 0xff;
  }

  return ipToString(buff);
};

export const ipMask = (addr: string, mask: string) => {
  const addrBuf = ipToBuffer(addr);
  const maskBuf = ipToBuffer(mask);

  const result = [];

  // Same protocol - do bitwise and
  let i;
  if (addrBuf.length === maskBuf.length) {
    for (i = 0; i < addrBuf.length; i++) {
      result[i] = addrBuf[i] & maskBuf[i];
    }
  } else if (maskBuf.length === 4) {
    // IPv6 address and IPv4 mask
    // (Mask low bits)
    for (i = 0; i < maskBuf.length; i++) {
      result[i] = addrBuf[addrBuf.length - 4 + i] & maskBuf[i];
    }
  } else {
    // IPv6 mask and IPv4 addr
    for (i = 0; i < result.length - 6; i++) {
      result[i] = 0;
    }

    // ::ffff:ipv4
    result[10] = 0xff;
    result[11] = 0xff;
    for (i = 0; i < addrBuf.length; i++) {
      result[i + 12] = addrBuf[i] & maskBuf[i + 12];
    }
    i += 12;
  }
  for (; i < result.length; i++) {
    result[i] = 0;
  }
  console.log(result);

  return ipToString(result);
};

export const ipCidr = (cidrString: string) => {
  const cidrParts = cidrString.split("/");

  const addr = cidrParts[0];
  if (cidrParts.length !== 2) {
    throw new Error(`invalid CIDR subnet: ${addr}`);
  }

  const mask = ipFromPrefixLen(parseInt(cidrParts[1], 10)) as string;

  return ipMask(addr, mask);
};

export const ipSubnet = function (addr: string, mask: string) {
  const networkAddress = ipToLong(ipMask(addr, mask) as string);

  // Calculate the mask's length.
  const maskBuffer = ipToBuffer(mask);
  let maskLength = 0;

  for (let i = 0; i < maskBuffer.length; i++) {
    if (maskBuffer[i] === 0xff) {
      maskLength += 8;
    } else {
      let octet = maskBuffer[i] & 0xff;
      while (octet) {
        octet = (octet << 1) & 0xff;
        maskLength++;
      }
    }
  }

  const numberOfAddresses = 2 ** (32 - maskLength);

  return {
    networkAddress: ipFromLong(networkAddress),
    firstAddress: numberOfAddresses <= 2
      ? ipFromLong(networkAddress)
      : ipFromLong(networkAddress + 1),
    lastAddress: numberOfAddresses <= 2
      ? ipFromLong(networkAddress + numberOfAddresses - 1)
      : ipFromLong(networkAddress + numberOfAddresses - 2),
    broadcastAddress: ipFromLong(networkAddress + numberOfAddresses - 1),
    subnetMask: mask,
    subnetMaskLength: maskLength,
    numHosts: numberOfAddresses <= 2
      ? numberOfAddresses
      : numberOfAddresses - 2,
    length: numberOfAddresses,
    contains(other: string) {
      return networkAddress === ipToLong(ipMask(other, mask) as string);
    },
  };
};

export const ipCidrSubnet = (cidrString: string) => {
  const cidrParts = cidrString.split("/");

  const addr = cidrParts[0];
  if (cidrParts.length !== 2) {
    throw new Error(`invalid CIDR subnet: ${addr}`);
  }

  const mask = ipFromPrefixLen(parseInt(cidrParts[1], 10)) as string;

  return ipSubnet(addr, mask);
};

export const ipNot = (addr: string) => {
  const buff = ipToBuffer(addr);
  for (let i = 0; i < buff.length; i++) {
    buff[i] = 0xff ^ buff[i];
  }
  return ipToString(buff) as string;
};
