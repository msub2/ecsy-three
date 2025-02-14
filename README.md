# ecsy-three

We created ecsy-three to facilitate developing applications using [ECSY](https://ecsy.io) and [three.js](https://threejs.org). It is a set of components and systems for interacting with ThreeJS from ECSY. Right now, we have a core API design that we are iterating on and we hope to build higher level abstractions against.

# Getting Started

If you aren't familiar with the ECSY API, you should read the [ECSY Documentation](https://ecsy.io/docs) first.

## ECSY Three Core

The core API for ecsy-three is just a few additional concepts on top of ECSY.

First, you must create an instance of `ECSYThreeWorld` instead of `World`.

```javascript
import { ECSYThreeWorld } from "ecsy-three";

const world = new ECSYThreeWorld();
```

`ECSYThreeWorld` registers a custom `ECSYThreeEntity` class with some helper methods for working with ThreeJS.

You can add any `Object3D` to an `ECSYThreeEntity` using `addObject3DComponent(object3D, parentEntity)`

```javascript
import { Scene, Mesh, BoxBufferGeometry, MeshBasicMaterial, TextureLoader } from "three";

const scene = world
  .createEntity()
  .addObject3DComponent(new Scene()); // scene is the root Object3d and has no parent

const geometry = new BoxBufferGeometry(20, 20, 20);

const material = new MeshBasicMaterial({
  map: new TextureLoader().load("./textures/crate.gif")
});

const mesh = new Mesh(geometry, material);

const box = world
  .createEntity()
  .addObject3DComponent(mesh, scene); // mesh is parented to the scene entity
```

`addObject3DComponent()` will add the `Object3DComponent` as well as a series of `TagComponent`s using the world's `object3DInflator`. When adding a `Scene` object3d to an entity, it will also add the `SceneTagComponent`. For the `Mesh` object3d, a `MeshTagComponent` will be added. These tag components can be used in `System` queries to get instances of certain object3ds. You can then use `entity.getObject3D()` to get the object3d for that entity.

```javascript
import { MeshTagComponent, Object3DComponent } from "ecsy-three";
import { System } from "ecsy";

class RandomColorSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      // This will always return a Mesh since we are querying for the MeshTagComponent
      const mesh = entity.getObject3D();
      mesh.material.color.setHex(Math.random() * 0xffffff);
    });
  }
}

RandomColorSystem.queries = {
  entities: {
    components: [MeshTagComponent, Object3DComponent]
  }
};
```

Right now, there are inflators defined for `Scene`, `Mesh`, and `Camera`. Additional object3d classes can be added by setting `world.object3DInflator` to your own object3DInflator. You can find the `defaultObject3DInflator` [here](https://github.com/MozillaReality/ecsy-three/blob/dev/src/core/defaultObject3DInflator.js).

If you want to remove an Object3D from an entity, you can call `entity.removeObject3DComponent()` which will remove the object3D from the entity and detach it from its current parent.

Finally, if you want to get the entity for a give object3d you can use `object3D.entity`. This property is added to the object3D when calling `entity.addObject3DComponent` and removed when calling `entity.removeObject3DComponent()`.

That is essentially all there is to the ecsy-three core API at this time. With just these few additional components you can write most ThreeJS code against ECSY.

# ECSY Three Extras

The core API is pretty minimal, but we want to eventually provide components and systems that encapsulate common behavior and patterns. The [extras folder](https://github.com/MozillaReality/ecsy-three/tree/master/src/extras) contains our own experiments to create these components and systems. These are likely to change so we won't be documenting them right away, but you are free to pull ideas from them or use them in your projects.

We should make it clear, we don't know if these patterns are any good yet. We'd like to hear from community and iterate on these ideas with your input before moving them into the core library. Some components will not fit in the core and for those we encourage you to go build libraries and work together to find common patterns. We hope to hear from you in the GitHub issues and in our Discord! Good luck and have fun building!
