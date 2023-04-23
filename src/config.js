export default {
    ioLogicServers: [
        // You can add as many (or as few) Moxa ioLogic server as necessary in here...
        {
            address: '127.0.0.1',
            label: 'E1214 [Local Testing]',
            relays: {
                r0: { role: undefined, nth: 0 },
                r1: { role: undefined, nth: 1 },
                r2: { role: 'LIGHT', nth: 2, label: 'TRL-D401-PASS (Light = #00ff00)', group: 'TRL-D401' },
                r3: { role: 'LIGHT', nth: 3, label: 'TRL-D401-STOP (Light = #ff0000)', group: 'TRL-D401' },
                r4: { role: 'BOOM', nth: 4, label: 'BOOM-D405 (Trigger = OPEN)' },
                r5: { role: undefined, nth: 5 },
            }
        },
    ],
    msServerPollInterval: 500, // Note: each relay on a server gets polled simultaneously; some servers don't like DDOS
};
