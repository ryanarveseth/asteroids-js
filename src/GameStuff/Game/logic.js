
const distanceNextFrame = (a, b) => 
    Math.sqrt((a.x + a.velX - b.x - b.velX)**2 + (a.y + a.velY - b.y - b.velY)**2) - a.radius - b.radius;

export const collisions = (asteroids) => {
    for (let i in asteroids) {
        for (let x in asteroids) {
            if (i !== x && distanceNextFrame(asteroids[i], asteroids[x]) <= 0) {
                const theta1 = asteroids[i].getAngle();
                const theta2 = asteroids[x].getAngle();
                const phi = Math.atan2((asteroids[x].y - asteroids[x].radius) - (asteroids[i].y - asteroids[i].radius), 
                (asteroids[x].x - asteroids[x].radius) - (asteroids[i].x - asteroids[i].radius));
                const m1 = asteroids[i].mass;
                const m2 = asteroids[x].mass;
                const v1 = asteroids[i].getSpeed();
                const v2 = asteroids[x].getSpeed();

                const dx1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.cos(phi) + v1*Math.sin(theta1-phi) * Math.cos(phi+Math.PI/2);
                const dy1F = (v1 * Math.cos(theta1 - phi) * (m1-m2) + 2*m2*v2*Math.cos(theta2 - phi)) / (m1+m2) * Math.sin(phi) + v1*Math.sin(theta1-phi) * Math.sin(phi+Math.PI/2);
                const dx2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.cos(phi) + v2*Math.sin(theta2-phi) * Math.cos(phi+Math.PI/2);
                const dy2F = (v2 * Math.cos(theta2 - phi) * (m2-m1) + 2*m1*v1*Math.cos(theta1 - phi)) / (m1+m2) * Math.sin(phi) + v2*Math.sin(theta2-phi) * Math.sin(phi+Math.PI/2);

                if (asteroids[i].velX !== dx1F || 
                    asteroids[i].velY !== dy1F || 
                    asteroids[x].velX !== dx2F || 
                    asteroids[x].velY !== dy2F) {
                    asteroids[i].velX = dx1F;
                    asteroids[i].velY = dy1F;
                    asteroids[x].velX = dx2F;
                    asteroids[x].velY = dy2F;
                }            
            }
        }
    }
}