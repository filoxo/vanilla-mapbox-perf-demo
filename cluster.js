export default class ClusterManager {

    constructor() {
        this.objects = {};
    }
    addNode(lngLat, obj) {
        if (lngLat && lngLat.length >= 2) {
            const lng = lngLat[0].toFixed(4);
            const lat = lngLat[1].toFixed(4);
            if (Math.abs(+lat) <= 90) {
                if (!this.objects[lng]) {
                    this.objects[lng] = {};
                }
                if (!this.objects[lng][lat]) {
                    this.objects[lng][lat] = [];
                }
                this.objects[lng][lat].push(obj);
            }
        }
    }

    getClusters(level) {
        const dist = 40 * (360 / (512 * Math.pow(2, level)));
        const clusters = [];
        // tslint:disable-next-line:forin
        for (const lng in this.objects) {
            // tslint:disable-next-line:forin
            for (const lat in this.objects[lng]) {
                const data = this.objects[lng][lat];
                const count = data.length;
                let found = false;
                clusters.forEach(cluster => {
                    if (this.dist([+lng, +lat], cluster.lngLat) < dist && !found) {
                        found = true;
                        cluster.sumLngLat = [cluster.sumLngLat[0] + (+lng * count), cluster.sumLngLat[1] + (+lat * count)];
                        cluster.count += count;
                        cluster.data = cluster.data.concat(data);
                    }
                });
                if (!found) {
                    clusters.push({
                        lngLat: [+lng, +lat],
                        sumLngLat: [(+lng * count), (+lat * count)],
                        count: count,
                        data: data
                    });
                }
            }
        }

        const results = clusters.map(cluster => ({
            lngLat: [cluster.sumLngLat[0] / cluster.count, cluster.sumLngLat[1] / cluster.count],
            data: cluster.data
        }));

        results.sort((a, b) => {
            return b.lngLat[1] - a.lngLat[1];
        }); // Sort so that the southernmost are on top
        return results;
    }

    dist(lngLat1, lngLat2) {
        return Math.sqrt(Math.pow(lngLat2[0] - lngLat1[0], 2) + Math.pow(lngLat2[1] - lngLat1[1], 2));
    }
}