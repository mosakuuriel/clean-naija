const typing = document.getElementById('typing');

if (typing) {
    const word = [
        "OGUN STATE",
        "LAGOS STATE"
    ];

    let index = 0;
    let letter = 0;
    let deleting = false;

    function typeEffect() {
        let words = word[index];
        if (deleting) {
            letter--;
        } else {
            letter++;
        }
        typing.textContent = words.substring(0, letter);

        if (!deleting && letter === words.length) {
            deleting = true;
            setTimeout(typeEffect, 1000);
            return;
        }

        if (deleting && letter === 0) {
            deleting = false;
            index = (index + 1) % word.length;
        }

        setTimeout(typeEffect, deleting ? 40 : 80)
    }

    typeEffect();
}

const myModal = document.getElementById('myModal');
const myInput = document.getElementById('myInput');

if (myModal && myInput) {
    myModal.addEventListener('shown.bs.modal', () => {
        myInput.focus();
    });
}








const map = L.map("map").setView([6.5244, 3.3792], 12);




L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);




let marker = L.marker([6.5244, 3.3792], {
    draggable: true
}).addTo(map);




let selectedLocation = null;




async function updateLocation(lat, lng) {

    selectedLocation = {
        latitude: lat,
        longitude: lng,
        address: ""
    };

    marker.setLatLng([lat, lng]);

    document.getElementById("latitude").textContent =
        lat.toFixed(6);

    document.getElementById("longitude").textContent =
        lng.toFixed(6);

    document.getElementById("selectedAddress").textContent =
        "Finding address...";

    document.getElementById("locationStatus").textContent =
        "Location selected. Retrieving address...";

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );

        if (!response.ok) {
            throw new Error("Address lookup failed");
        }

        const data = await response.json();

        selectedLocation.address = data.display_name || "";

        document.getElementById("selectedAddress").textContent =
            data.display_name || "Address unavailable";

        // Fill address fields when the map returns the information.
        const details = data.address || {};

        document.getElementById("city").value =
            details.city ||
            details.town ||
            details.village ||
            details.suburb ||
            "";

        document.getElementById("address").value =
            [
                details.road,
                details.house_number
            ].filter(Boolean).reverse().join(" ") ||
            details.neighbourhood ||
            details.suburb ||
            "";

        document.getElementById("landmark").value =
            details.amenity ||
            details.shop ||
            "";

        const stateField = document.getElementById("state");

        const stateName = details.state || "";

        const matchingOption = [...stateField.options].find(
            option =>
                option.value.toLowerCase() === stateName.toLowerCase()
        );

        if (matchingOption) {
            stateField.value = matchingOption.value;
        }

        document.getElementById("locationStatus").textContent =
            "Location selected successfully.";

    } catch (error) {

        document.getElementById("selectedAddress").textContent =
            "Address unavailable. You can still use the selected coordinates.";

        document.getElementById("locationStatus").textContent =
            "Coordinates selected. Address lookup failed.";
    }
}


// 6. Click anywhere on the map to select a location.

map.on("click", function (event) {

    updateLocation(
        event.latlng.lat,
        event.latlng.lng
    );

});


// 7. Allow users to drag the marker.

marker.on("dragend", function (event) {

    const position = event.target.getLatLng();

    updateLocation(
        position.lat,
        position.lng
    );

});


// 8. Search for a location in Nigeria.

async function searchPlace() {

    const query = document.getElementById("searchLocation")
        .value.trim();

    if (!query) {
        alert("Enter a location to search.");
        return;
    }

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ng&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const results = await response.json();

        if (!results.length) {
            alert("Location not found. Try another search.");
            return;
        }

        const place = results[0];

        const lat = Number(place.lat);
        const lng = Number(place.lon);

        map.setView([lat, lng], 16);

        updateLocation(lat, lng);

    } catch (error) {

        alert("Unable to search right now. Please try again.");

    }
}


// Search button.

document.getElementById("searchButton").addEventListener("click", searchPlace);


// Search when the user presses Enter.

document.getElementById("searchLocation").addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            event.preventDefault();
            searchPlace();
        }

    }
);


// 9. Get the user's current location.

document.getElementById("currentLocation").addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {
            alert("Your browser does not support location services.");
            return;
        }

        const button = this;

        button.disabled = true;
        button.textContent = "Finding your location...";

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                map.setView([lat, lng], 16);

                updateLocation(lat, lng);

                button.disabled = false;

                button.innerHTML =
                    '<i class="fa-solid fa-crosshairs me-2"></i> Use My Current Location';

            },

            function () {

                alert(
                    "Location access failed. Allow permission or select a place on the map."
                );

                button.disabled = false;

                button.innerHTML =
                    '<i class="fa-solid fa-crosshairs me-2"></i> Use My Current Location';

            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    }
);


// 10. Save the selected location.

document.getElementById("locationForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        if (!selectedLocation) {
            alert("Please select a location on the map first.");
            return;
        }

        const locationData = {

            state: document.getElementById("state").value,

            city: document.getElementById("city").value.trim(),

            address: document.getElementById("address").value.trim(),

            landmark: document.getElementById("landmark").value.trim(),

            latitude: selectedLocation.latitude,

            longitude: selectedLocation.longitude,

            mapAddress: selectedLocation.address

        };

        sessionStorage.setItem(
            "cleanNaijaLocation",
            JSON.stringify(locationData)
        );

        alert("Your location has been saved successfully!");

    }
);




updateLocation(6.5244, 3.3792);




const houseForm = document.getElementById("houseCleaningForm");

if (houseForm) {
    houseForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("houseAddress").value.trim();
        const description = document.getElementById("cleaningDescription").value.trim();

        const selectedAreas = [
            ...houseForm.querySelectorAll(".cleaning-option:checked")
        ];

        const areas = selectedAreas.map(option => option.value);

        const areasMessage = areas.length
            ? areas.map(area => `- ${area}`).join("\n")
            : "No cleaning areas selected";

        const pictures = document.getElementById("cleaningPictures");

        const pictureMessage = pictures && pictures.files.length > 0
            ? `${pictures.files.length} picture(s) uploaded through the website.`
            : "No pictures selected.";

        const booking = {
            id: "CN-" + Date.now(),
            name: name,
            phone: phone,
            address: address,
            areas: areas,
            description: description,
            pictures: pictureMessage,
            status: "Pending",
            service: "House Cleaning",
            date: new Date().toLocaleDateString("en-NG"),
            submittedAt: new Date().toISOString()
        };

        const storageKey = "cleanNaijaBookings";

        let bookings = [];

        try {
            const savedBookings = localStorage.getItem(storageKey);
            bookings = savedBookings ? JSON.parse(savedBookings) : [];

            if (!Array.isArray(bookings)) {
                bookings = [];
            }

            bookings.push(booking);

            localStorage.setItem(storageKey, JSON.stringify(bookings));
        } catch (error) {
            alert("Your booking could not be saved. Please try again.");
            return;
        }

        const message = `🌿 *CLEAN NAIJA — HOUSE CLEANING REQUEST*

*CUSTOMER DETAILS*
Full Name: ${name}
Phone Number: ${phone}
House Address: ${address}

*SELECTED CLEANING AREAS AND ITEMS*
${areasMessage}

*ADDITIONAL DETAILS*
${description || "No additional details provided."}

*PICTURES*
${pictureMessage}
Please note: Pictures may need to be sent separately on WhatsApp.

*PRICING NOTICE*
The price depends on the size, condition, and cleaning required.
Please review my request and pictures and confirm the final quotation before cleaning begins.

Booking Reference: ${booking.id}

Thank you for choosing Clean Naija! 🌿`;

        const whatsappNumber = "2349035066048";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        alert(
            `Thank you for choosing Clean Naija, ${name}!\n\n` +
            `Your booking has been saved. WhatsApp will open with your booking details. ` +
            `Please send the message to complete your request.`
        );

        window.open(whatsappURL, "_blank");
    });
}


const publicCleaningForm = document.getElementById("publicCleaningForm");

if (publicCleaningForm) {
    publicCleaningForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("reporterName").value.trim();
        const phone = document.getElementById("reporterPhone").value.trim();
        const email = document.getElementById("reporterEmail").value.trim();
        const problemType = document.getElementById("problemType").value;
        const problemSize = document.getElementById("problemSize").value;
        const address = document.getElementById("publicAddress").value.trim();
        const description = document.getElementById("problemDescription").value.trim();
        const volunteerCount = Number(document.getElementById("volunteerCount").value);
        const otherTools = document.getElementById("otherCommunityTools").value.trim();
        const preferredDate = document.getElementById("preferredCleanupDate").value;

        const picturesInput = document.getElementById("publicPictures");
        const pictures = Array.from(picturesInput.files);

        const communityTools = [
            ...document.querySelectorAll(".community-tool:checked")
        ].map(tool => tool.value);

        if (otherTools) {
            communityTools.push(otherTools);
        }

        if (volunteerCount !== 10) {
            alert("Please arrange exactly 10 community volunteers.");
            return;
        }

        if (!pictures.length) {
            alert("Please upload at least one picture of the public area.");
            return;
        }

        const booking = {
            id: "CN-PUB-" + Date.now(),
            service: "Public Cleaning",
            name,
            phone,
            email,
            problemType,
            problemSize,
            address,
            description,
            volunteerCount,
            communityTools,
            cleanNaijaTeamCount: 5,
            totalPlannedTeam: 15,
            pictureNames: pictures.map(picture => picture.name),
            preferredDate,
            status: "Pending",
            price: 0,
            submittedAt: new Date().toISOString()
        };

        try {
            const storageKey = "cleanNaijaBookings";
            const savedBookings = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (!Array.isArray(savedBookings)) {
                throw new Error("Invalid booking data.");
            }

            savedBookings.push(booking);

            localStorage.setItem(
                storageKey,
                JSON.stringify(savedBookings)
            );
        } catch (error) {
            alert("The report could not be saved. Please try again.");
            return;
        }


        document.getElementById("publicReportReference").textContent = booking.id;

        const successModalElement = document.getElementById("publicSuccessModal");
        const successModal = bootstrap.Modal.getOrCreateInstance(successModalElement);

        successModal.show();

        publicCleaningForm.reset();


    });
}


const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");

        const isLightMode = document.body.classList.contains("light-mode");

        if (isLightMode) {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
        } else {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
        }
    });
}
