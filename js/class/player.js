class Player extends Plane{
    
    setup() {
        super.setup('player');
        this.initBullet('playerBullet', this.scene.playerBullets);
        this.event();           // for keyboard input
        this.mobileControl();   // for touch/mobile button input
    }

    up() {
        if (this.y <= 0) return;
        this.y-=this.speed;
    }
    left() {
        if (this.x <= 0) return;
        this.x-=this.speed;
    }
    right() {
        if (this.x+this.w >= config.game.w) return;
        this.x+=this.speed;
    }
    down() {
        if (this.y+this.h >= config.game.h) return;
        this.y+=this.speed;
    }

    event() {
        const called = callback=>{
            if (!this.run) return;
            if (this.scene.pauseFlag) return;
            if (this.scene.game.data.end) return;
            callback.call(this);
        };
        const keys = {
            'w': this.up,
            'a': this.left,
            's': this.down,
            'd': this.right,
        };
        Object.keys(keys).map((key) => {
            hotkey.reg(key, () => {
               called(keys[key]);
            }); 
        });
        
        hotkey.reg(' ', () => {
            called(()=>{
                res.replay('shoot');
                this.fire();
            });
        }, true);
    }

    mobileControl() {
        const called = callback => {
            if (!this.run || this.scene.pauseFlag || this.scene.game.data.end) return;
            callback.call(this);
        };
    
        // Handle continuous movement
        const holdButton = (id, action) => {
            const el = document.getElementById(id);
            let interval;
    
            if (el) {
                const start = () => {
                    called(action); // Initial call
                    interval = setInterval(() => called(action), 50); // Repeat every 50ms
                };
                const end = () => clearInterval(interval);
    
                // Support both mouse and touch events
                el.addEventListener('mousedown', start);
                el.addEventListener('touchstart', start);
                el.addEventListener('mouseup', end);
                el.addEventListener('mouseleave', end);
                el.addEventListener('touchend', end);
                el.addEventListener('touchcancel', end);
            }
        };
    
        holdButton('btn-up', this.up);
        holdButton('btn-down', this.down);
        holdButton('btn-left', this.left);
        holdButton('btn-right', this.right);
    
        // Smooth fire button
        const fireBtn = document.getElementById('btn-fire');
        let fireInterval;
        const fire = () => {
            called(() => {
                res.replay('shoot');
                this.fire();
            });
        };
    
        if (fireBtn) {
            const startFire = () => {
                fire(); // Initial fire
                fireInterval = setInterval(fire, 200); // Fire every 200ms
            };
            const stopFire = () => clearInterval(fireInterval);
    
            fireBtn.addEventListener('mousedown', startFire);
            fireBtn.addEventListener('touchstart', startFire);
            fireBtn.addEventListener('mouseup', stopFire);
            fireBtn.addEventListener('mouseleave', stopFire);
            fireBtn.addEventListener('touchend', stopFire);
            fireBtn.addEventListener('touchcancel', stopFire);
        }
    }
    
    
}