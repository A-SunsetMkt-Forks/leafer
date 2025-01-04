import { ILeaf, ISelector, ISelectorProxy, IPickResult, IPickOptions, IPointData, ISelectorConfig, IFinder, IFindMethod, IFindCondition, IPicker } from '@leafer/interface'
import { Creator, DataHelper, Plugin } from '@leafer/core'

import { Picker } from './Picker'


export class Selector implements ISelector {

    public target?: ILeaf // target 不存在时，为临时选择器（不能缓存数据）
    public proxy?: ISelectorProxy // editor

    public config: ISelectorConfig = {}

    public picker: IPicker
    public finder?: IFinder

    constructor(target: ILeaf, userConfig?: ISelectorConfig) {
        if (userConfig) this.config = DataHelper.default(userConfig, this.config)
        this.picker = new Picker(this.target = target, this)
        this.finder = Creator.finder && Creator.finder()
    }

    // @leafer-ui/node will rewrite
    public getByPoint(hitPoint: IPointData, hitRadius: number, options?: IPickOptions): IPickResult {
        if (this.target) this.target.updateLayout()
        return this.picker.getByPoint(hitPoint, hitRadius, options)
    }

    // @leafer-in/find will rewrite
    public getBy(condition: number | string | IFindCondition | IFindMethod, branch?: ILeaf, one?: boolean, options?: any): ILeaf | ILeaf[] {
        return this.finder ? this.finder.getBy(condition, branch, one, options) : Plugin.need('find')
    }

    public destroy(): void {
        this.picker.destroy()
        if (this.finder) this.finder.destroy()
    }

}