window.onload = function(event) 
{
    // Now get the api data
    doFillFetch();
    
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

async function performFetch(apiurl, options, func)
{
    // Disable
    turnOffInteraction();

    // Get the JWT from file
    let jwt = getJwt();

    // Add the 
    options.headers = { 'Authorization': 'Bearer ' + jwt }

    // Perform the fetch
    fetch(apiurl, options)
    
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
        func(data)
    })

    .catch(function (error) 
    {
        console.warn(error);
        disableInteraction();
    });
}

async function doFillFetch()
{
    // Create the API URL
    let apiurl = window.location.protocol + '//' + window.location.hostname + '/fill';

    let options = 
    {
        method: 'POST'
    }
    
    performFetch(apiurl, options, fillText);
}

async function doUpload()
{
    let form = document.getElementById('formFile');
    let data = new FormData(form);

    let options = 
    {
        method: 'POST',
        body: data
    }
    
    performFetch(form.action, options, fillText);
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
    button.children[0].classList.add('visually-hidden');
    button.children[1].classList.remove('visually-hidden');
    button.children[2].classList.remove('visually-hidden');
}

function turnOnInteraction()
{
    // Enable download button
    let button = document.getElementById('top-dl-button');
    button.removeAttribute('disabled', '');
    button.children[0].classList.remove('visually-hidden');
    button.children[1].classList.add('visually-hidden');
    button.children[2].classList.add('visually-hidden');
}

function disableInteraction()
{
    // Disable download button
    let button = document.getElementById('top-dl-button')
    button.setAttribute('disabled', '');
    button.children[0].classList.remove('visually-hidden');
    button.children[1].classList.add('visually-hidden');
    button.children[2].classList.add('visually-hidden');
}

function fillText(data)
{
    if(data)
    {
        // Put text into the areas
        document.getElementById('paperview').innerHTML = data['paperview'];
        document.getElementById('tableview').innerHTML = data['tableview'];
        turnOnInteraction();
    }

    else
    {
        // Put text into the areas
        document.getElementById('paperview').innerHTML = '';
        document.getElementById('tableview').innerHTML = '';
        disableInteraction();
    }

}