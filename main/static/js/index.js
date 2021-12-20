window.onload = function(event) 
{
    // Now get the api data
    //doFillFetch();

    // Disable download
    document.getElementById('download-group').setAttribute('disabled', '');
    
    document.addEventListener('click', function (event) 
    {
        if(event.target.hasAttribute('data-link'))
        {
            console.log(event.target)

            let href = event.target.hash.replace("#", "");
            let a = 1;
            let fade = document.getElementById(href);
            let counter = 10;

            let baseback = fade.style.backgroundColor;
            let basecolor = fade.style.color;
    
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

        else if(event.target.hasAttribute('data-download'))
        {
            doDownloadFetch(event.target.getAttribute('data-download'));
        }
    });

    document.getElementById('upload').addEventListener('change', function(event)
    {
        // Disable download
        document.getElementById('download-group').setAttribute('disabled', '');

        let form = document.getElementById('formFile');
        let data = new FormData(form);

        event.preventDefault();

        fetch(form.action, 
        {
            method: 'POST',
            body: data,
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
            if(data['completed'])
            {
                // Now get the api data
                doFillFetch();
            }

            else
            {
                alert('Something Went Wrong!')
            }
        })

        .catch(function (error) 
        {
            console.warn(error);
            document.getElementById('content').classList.add("visually-hidden");
        });
    });
};

async function doFillFetch()
{
    let apiurl = document.querySelector('meta[name=data-api]').getAttribute('content') + 'fill';
    let jwt = document.querySelector('meta[name=token]').getAttribute('content');

    fetch(apiurl, 
    {
        method: 'POST',
        headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }
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
        document.getElementById('paperview').innerHTML = data['paperview'];
        document.getElementById('tableview').innerHTML = data['tableview'];

        // Enable the download
        document.getElementById('download-group').removeAttribute('disabled');
    })

    .catch(function (error) 
    {
        console.warn(error);
    });
}

async function doDownloadFetch(value)
{
    let apiurl = new URL(document.querySelector('meta[name=data-api]').getAttribute('content') + 'download');
    let jwt = document.querySelector('meta[name=token]').getAttribute('content');

    apiurl.searchParams.append('which', value);
    apiurl.searchParams.append('token', jwt)

    window.location = apiurl.href
}