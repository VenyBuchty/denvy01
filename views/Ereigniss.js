class Ereigniss {
    constructor(latlng, { info = null, time = null, startTime = null, endTime = null, dauer = null, isMarker = null, geoLabel = [], distance = null } = {}) {
        this.latlng = latlng
        this.info = info
        this.time = time
        this.dauer = dauer
        this.startTime = startTime
        this.endTime = endTime
        this.geoLabel = geoLabel
        this.distance = distance
        this.isMarker = isMarker
        this.startMarker = this.getStartMarker()
        this.endMarker = this.getEndMarker()
        this.id = Date.now()

    }

    getStartMarker() {
        return this.startMarker = this.latlng[0]
    }

    getEndMarker() {
        return this.endMarker = this.latlng[this.latlng.length - 1]
    }

    setGeoLabel(geoLabel) {
        this.geoLabel.push(geoLabel)
        return this
    }

    setDistance(distance) {
        this.distance = distance
        return this
    }

    setIsMarker(isMarker) {
        this.isMarker = isMarker
        return this
    }

    setInfo(info) {
        this.info = info
        return this
    }

    setTime(time) {
        this.time = time
        return this
    }

    setStartTime() {
        this.startTime = startTime
        return this
    }

    setEndTime() {
        this.endTime = endTime
        return this
    }

    setDauer(dauer) {
        this.dauer = dauer
        return this
    }

    setLatlng(latlng) {
        this.latlng = latlng
        return this
    }
}