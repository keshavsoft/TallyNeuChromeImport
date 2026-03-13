async function startFunc(data) {
    const res = await fetch("http://localhost:9000", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "TallyRequest": "Import",
            "Type": "Data",
            "Id": "Vouchers"
        },
        body: JSON.stringify(data)
    });

    return await res.json();
};

export { startFunc };