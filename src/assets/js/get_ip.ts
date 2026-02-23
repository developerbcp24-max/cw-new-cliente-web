const Get_Ip = {
  obtenerIP: async function () {
    try {
      let response = await fetch("https://api64.ipify.org?format=json");
      if (!response.ok) throw new Error("Error obteniendo la IP desde api64.ipify.org");
      let data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error desde api64.ipify.org:", error);
      try {
        const response = await fetch("https://ifconfig.me/ip", {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Error obteniendo la IP desde ifconfig.me");
        const ip = await response.text();
        return ip.trim();
      } catch (error) {
        console.error("Error desde ifconfig.me:", error);
        try {
          const response = await fetch("https://jsonip.com");
          if (!response.ok) throw new Error("Error obteniendo la IP desde jsonip.com");
          const data = await response.json();
          return data.ip;
        } catch (error) {
          return "NOT_IP";
        }
      }
    }
  }
};
export default Get_Ip;
