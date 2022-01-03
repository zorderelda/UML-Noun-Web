window.onload = function(event) 
{
    // Now get the api data
    doFetch('paperview');
    doFetch('tableview');
    
    document.addEventListener('click', function (event) 
    {
        // Check to see if we are blinking the anchor
        if(event.target.hasAttribute('data-link'))
        {
            let href = event.target.hash.replace("#", "");
            let a = 1;
            let fade = document.getElementById(href);
            let counter = 10;

            // Make sure its a real variable
            if(fade == null)
                return

            let baseback = fade.style.backgroundColor;
            let basecolor = fade.style.color;

            // Perform the fadeout
            var fadeOut = setInterval(function () 
            {
                //check if the number is even
                if(counter % 2 == 0) 
                {
                    fade.style.backgroundColor = 'orange';
                    fade.style.color = 'white';
                }

                // if the number is odd
                else 
                {
                    fade.style.backgroundColor = baseback;
                    fade.style.color = basecolor;
                }
                
                counter -= 1;

                if(counter < 1)
                {
                    fade.style.backgroundColor = baseback;
                    fade.style.color = basecolor;
                    clearInterval(fadeOut);
                }

            }, 200);
        }

        // Is this a request for download
        else if(event.target.hasAttribute('data-download'))
        {
            // Do the download
            event.preventDefault();
            doDownload(event.target.getAttribute('data-download'));
        }
    });

    // Listen for a change to the browse for file button
    document.getElementById('upload').addEventListener('change', function(event)
    {
        // Do the upload
        event.preventDefault();
        doUpload();
    });
};

function getJwt()
{
    return document.querySelector('meta[name=token]').getAttribute('content');
}

async function doUpload()
{
    let form = document.getElementById('formFile');
    let data = new FormData(form);

    // Disable
    turnOffInteraction();

    // Get the JWT from file
    let jwt = getJwt();

    // Get the full screen loader
    let loader = document.getElementById('loading-overlay')
    loader.classList.remove('visually-hidden');

    // Perform the fetch
    fetch(form.action, 
        {
            headers: { 'Authorization': 'Bearer ' + jwt },
            method: 'POST',
            body: data
        })
    
    .then(function (response) 
    {
        if (response.ok) 
        {
            return response.json();
        }
        return Promise.reject(response);
    })

    .then(function (data) 
    {
        // Done
        if('completed' in data)
        {
            // Now get the api data
            if(data['completed'] == true)
            {
                doFetch('paperview');
                doFetch('tableview');
            }
        }

        loader.classList.add('visually-hidden');
    })

    .catch(function (error) 
    {
        console.warn(error);
        loader.classList.add('visually-hidden');
    });
}

async function doFetch(which)
{
    // Disable
    turnOffInteraction();

    // Get the full screen loader
    let loader = document.getElementById('loading-overlay')
    loader.classList.remove('visually-hidden');

    // Get the JWT from file
    let jwt = getJwt();

    let apiurl = new URL(window.location.protocol + '//' + window.location.hostname + '/get')
    apiurl.searchParams.append('value', which);
    apiurl.searchParams.append('token', jwt);

    // Perform the fetch
    fetch(apiurl)
    
    .then(function (response) 
    {
        if(response.ok) 
        {
            return response.text();
        }
        return Promise.reject(response);
    })

    .then(function (data) 
    {
        // Put text into the areas
        document.getElementById(which).innerHTML = data;
        turnOnInteraction();
        loader.classList.add('visually-hidden');
    })

    .catch(function (error) 
    {
        console.warn(error);
        loader.classList.add('visually-hidden');
    });
}

async function doDownload(value)
{
    // Create the API URL
    let apiurl = new URL(window.location.protocol + '//' + window.location.hostname + '/download');
    let jwt = getJwt();

    // Send the request to the api
    apiurl.searchParams.append('which', value);
    apiurl.searchParams.append('jwt', jwt);
    
    // Get the file
    window.location = apiurl.href
}

function turnOffInteraction()
{
    // Disable download button
    let button = document.getElementById('top-dl-button');
    button.setAttribute('disabled', '');
}

function turnOnInteraction()
{
    // Enable download button
    let button = document.getElementById('top-dl-button');
    button.removeAttribute('disabled', '');
}