import { _Entity } from "ecsy";
import { Object3DComponent } from "./components/Object3DComponent.js";

export class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent, { value: obj });
    this._entityManager.world.inflateObject3DComponents(this, obj);
    if (parentEntity && parentEntity.hasComponent(Object3DComponent)) {
      parentEntity.getObject3D().add(obj);
    }
    return this;
  }

  removeObject3DComponent(unparent = true) {
    const obj = this.getComponent(Object3DComponent, true).value;
    if (unparent) {
      // Using "true" as the entity could be removed somewhere else
      obj.parent && obj.parent.remove(obj);
    }
    this.removeComponent(Object3DComponent);

    for (let i = this._ComponentTypes.length - 1; i >= 0; i--) {
      const Component = this._ComponentTypes[i];

      if (Component.isThreeTagComponent) {
        this.removeComponent(Component);
      }
    }

    obj.entity = null;
  }

  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      const obj = this.getObject3D();
      obj.traverse((o) => {
        if (o.entity) {
          this._entityManager.removeEntity(o.entity, forceImmediate);
        }
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    }
    this._entityManager.removeEntity(this, forceImmediate);
  }

  getObject3D() {
    const component = this.getComponent(Object3DComponent);
    return component && component.value;
  }
}
