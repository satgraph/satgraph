const func = async () => {
    const response = await window.services.ping()
    console.log(response) // prints out 'pong'
}

func()
