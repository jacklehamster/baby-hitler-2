const JAVASCRIPT_FILES = window.debugMode ? [ 'lib/newgroundsio.min.js','lib/ng.js','base/error-div.js','base/common.js','base/game.js','base/config.js','generated/config-size.js','generated/spritesheets/spritesheet.js','config/load-screen.js','base/translation.js','base/starter.js' ] : [ "generated/game-engine.min.js" ];
JAVASCRIPT_FILES.forEach(file => {
  document.write(`<script src="${file}"><\/script>`);
});

const CONFIG_FILES_TO_LOAD = window.debugMode ? [ 'config/9-months.js','config/alien.js','config/amari-baby.js','config/arcade-room.js','config/asteroid-field.js','config/birthday.js','config/bring-cake.js','config/bring-it-on.js','config/cake-face.js','config/call-gangsta.js','config/cards-showdown.js','config/ceiling-maze.js','config/cell-maze-2.js','config/cell-maze.js','config/concert.js','config/congrats.js','config/creator.js','config/crowd.js','config/deadly-landing.js','config/disk-screen.js','config/doctar-room.js','config/doctar.js','config/doom.js','config/drink-yupa.js','config/ecstacity.js','config/ending.js','config/ernest-card-dealing.js','config/ernest.js','config/evening-date.js','config/explore-tavern.js','config/final-corridor.js','config/final-credit.js','config/final-doom.js','config/final-exit.js','config/final-fight.js','config/final-planet-world.js','config/final-planet.js','config/final-title.js','config/first-prison-cell.js','config/gangsta-check-cards.js','config/gangsta-shootout.js','config/gangsta-table.js','config/guards-attack.js','config/guards-laughing-2.js','config/guards-laughing.js','config/human-woke.js','config/i-have-no-hand.js','config/in-progress.js','config/inside-tavern.js','config/jail-cell.js','config/lab.js','config/land-planet.js','config/landscape.js','config/leo-end.js','config/load-screen.js','config/lock-zoom.js','config/locker-room.js','config/look-over-there.js','config/look-right-left.js','config/maze-2.js','config/maze-3.js','config/maze-4.js','config/maze.js','config/meet-dick.js','config/mirror.js','config/money-shot.js','config/monster-in-space.js','config/morning-after.js','config/name-screen.js','config/not-so-fast.js','config/origin.js','config/outside-carnage.js','config/outside.js','config/panic-exit.js','config/poor-hitman.js','config/robot-dial.js','config/sarlie-planet-world.js','config/sarlie-planet.js','config/shop.js','config/shopkeepa.js','config/slots.js','config/space-adventure.js','config/space-travel.js','config/stars.js','config/start-screen.js','config/stay-here-baby-hitler.js','config/surface.js','config/tavern-entrance-zoom.js','config/tavern-entrance.js','config/tavern-phone.js','config/tavern-posters.js','config/tavern-stranger-zoom.js','config/temp-end.js','config/the-date.js','config/tile-hole.js','config/toilet-monster.js','config/toilet-zoom.js','config/toilets.js','config/training-room.js','config/vending-machine.js','config/we-take-care-of-you.js','config/what-so-funny.js','config/yupa-sarlie.js','config/zoom-arcade.js','config/zoom-guards.js','config/zoom-hottub-2.js','config/zoom-hottub.js','config/zoom-shop-monster.js','config/zoom-vending-machine.js' ] : [ 'generated/config/config-files-0.min.js','generated/config/config-files-1.min.js' ];
CONFIG_FILES_TO_LOAD.forEach(file => {
  document.write(`<script src="${file}" async><\/script>`);
});
