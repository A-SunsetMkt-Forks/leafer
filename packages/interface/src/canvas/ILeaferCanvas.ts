import { IObject } from '../data/IData'
import { IBounds, IMatrixData, IBoundsData, IAutoBoundsData, IAutoBounds, IScreenSizeData, IMatrixWithBoundsData, IPointData, IRadiusPointData } from '../math/IMath'
import { ICanvasContext2D, IWindingRule, IPath2D, ITextMetrics, CanvasGradient, CanvasPattern, ICanvasContext2DSettings } from './ICanvas'
import { IResizeEventListener } from '../event/IEvent'
import { IPathDrawer } from '../path/IPathDrawer'
import { InnerId } from '../event/IEventer'
import { ICanvasManager } from './ICanvasManager'
import { IExportFileType } from '../file/IFileType'
import { IExportOptions } from '../file/IExport'

export interface ILeaferCanvasConfig extends IAutoBoundsData {
    view?: string | IObject
    canvas?: string | IObject
    fill?: string
    pixelRatio?: number
    pixelSnap?: boolean // 是否对齐物理像素，避免图片/居中线条存在浮点坐标导致模糊
    pointSnap?: boolean // 是否对齐逻辑像素，尽力避免元素坐标点出现小数
    smooth?: boolean
    hittable?: boolean
    webgl?: boolean
    contextSettings?: ICanvasContext2DSettings
}

export type IHitCanvasConfig = ILeaferCanvasConfig

export interface ICanvasStrokeOptions {
    strokeWidth?: number
    strokeAlign?: string

    strokeCap?: string // lineCap
    strokeJoin?: string // lineJoin
    dashPattern?: number[] // lineDash
    dashOffset?: number // lineDashOffset
    miterLimit?: number
}

export interface ICanvasCacheOptions extends ICanvasStrokeOptions {
    fillStyle?: string | object
    strokeStyle?: string | object
}

export interface ICanvasAttr extends ICanvasStrokeOptions, IObject {

    smooth: boolean // imageSmoothingEnabled: boolean
    smoothLevel: string // imageSmoothingQuality: string
    opacity: number // globalAlpha: number
    blendMode: string  // globalCompositeOperation: string

    fillStyle: string | object

    strokeStyle: string | object
    strokeWidth: number // lineWidth

    shadowBlur: number
    shadowColor: string
    shadowOffsetX: number
    shadowOffsetY: number

    filter: string

    font: string
    fontKerning: string
    fontStretch: string
    fontVariantCaps: string

    textAlign: string
    textBaseline: string
    textRendering: string
    wordSpacing: string
    letterSpacing: string

    direction: string
}

interface ICanvasMethod {
    save(): void
    restore(): void

    fill(path?: IPath2D | IWindingRule, rule?: IWindingRule): void
    stroke(path?: IPath2D): void
    clip(path?: IPath2D | IWindingRule, rule?: IWindingRule): void

    fillRect(x: number, y: number, width: number, height: number): void
    strokeRect(x: number, y: number, width: number, height: number): void
    clearRect(x: number, y: number, width: number, height: number): void

    transform(a: number | IMatrixData, b?: number, c?: number, d?: number, e?: number, f?: number): void
    translate(x: number, y: number): void
    scale(x: number, y: number): void
    rotate(angle: number): void

    drawImage(image: CanvasImageSource, dx: number, dy: number): void
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

    setTransform(a: number | IMatrixData, b?: number, c?: number, d?: number, e?: number, f?: number): void
    getTransform(): IMatrixData
    resetTransform(): void

    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient
    createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient

    // text

    fillText(text: string, x: number, y: number, maxWidth?: number): void
    measureText(text: string): ITextMetrics
    strokeText(text: string, x: number, y: number, maxWidth?: number): void

    // custom

    saveBlendMode(blendMode?: string): void
    restoreBlendMode(): void

    hitFill(point: IPointData, fillRule?: string): boolean
    hitStroke(point: IPointData, strokeWidth?: number): boolean
    hitPixel(radiusPoint: IRadiusPointData, offset?: IPointData, scale?: number): boolean


    setStroke(strokeStyle: string | object, strokeWidth: number, options?: ICanvasStrokeOptions, childOptions?: ICanvasStrokeOptions): void
    setStrokeOptions(options: ICanvasStrokeOptions, childOptions?: ICanvasStrokeOptions): void

    setWorld(matrix: IMatrixData, parentMatrix?: IMatrixData): void
    useWorldTransform(worldTransform?: IMatrixData): void

    setWorldShadow(x: number, y: number, blur: number, color?: string): void
    setWorldBlur(blur: number): void

    copyWorld(canvas: ILeaferCanvas, fromBounds?: IBoundsData, toBounds?: IBoundsData, blendMode?: string): void
    copyWorldByReset(canvas: ILeaferCanvas, from?: IBoundsData, to?: IBoundsData, blendMode?: string, onlyResetTransform?: boolean): void
    copyWorldToInner(canvas: ILeaferCanvas, fromWorld: IMatrixWithBoundsData, toInnerBounds: IBoundsData, blendMode?: string): void

    useGrayscaleAlpha(bounds: IBoundsData): void
    useMask(maskCanvas: ILeaferCanvas, fromBounds?: IBoundsData, toBounds?: IBoundsData): void
    useEraser(eraserCanvas: ILeaferCanvas, fromBounds?: IBoundsData, toBounds?: IBoundsData): void

    fillWorld(bounds: IBoundsData, color: string | object, blendMode?: string): void
    strokeWorld(bounds: IBoundsData, color: string | object, blendMode?: string): void
    clipWorld(bounds: IBoundsData, ceilPixel?: boolean): void
    clipUI(ruleData: IWindingRuleData): void

    clearWorld(bounds: IBoundsData, ceilPixel?: boolean): void
    clear(): void
}


export type ILeaferCanvasView = any
export interface ILeaferCanvas extends ICanvasAttr, ICanvasMethod, IPathDrawer {

    readonly innerId: InnerId
    name: string

    manager: ICanvasManager

    readonly width: number
    readonly height: number

    readonly pixelRatio: number
    readonly pixelWidth: number
    readonly pixelHeight: number

    pixelSnap: boolean

    readonly allowBackgroundColor?: boolean
    backgroundColor?: string
    hittable?: boolean

    zIndex?: number
    childIndex?: number

    bounds: IBounds
    clientBounds: IBoundsData

    config: ILeaferCanvasConfig

    autoLayout: boolean

    view: ILeaferCanvasView
    parentView: any

    unreal?: boolean

    context: ICanvasContext2D

    recycled?: boolean

    worldTransform: IMatrixData

    init(): void

    export(filename: IExportFileType | string, options?: IExportOptions | number | boolean): string | Promise<any>
    toBlob(type?: string, quality?: number): Promise<IBlob>
    toDataURL(type?: string, quality?: number): string | Promise<string>
    saveAs(filename: string, quality?: number): Promise<boolean>

    startAutoLayout(autoBounds: IAutoBounds, listener: IResizeEventListener): void
    stopAutoLayout(): void

    resize(size: IScreenSizeData, safeResize?: boolean): void
    updateViewSize(): void
    updateClientBounds(): void
    getClientBounds(update?: boolean): IBoundsData

    // other
    isSameSize(canvas: IScreenSizeData): boolean
    getSameCanvas(useSameWorldTransform?: boolean, useSameSmooth?: boolean): ILeaferCanvas
    recycle(clearBounds?: IBoundsData): void

    updateRender(bounds: IBoundsData): void
    unrealCanvas(): void
    destroy(): void
}


export interface IHitCanvas extends ILeaferCanvas {
    hitScale?: number
}


export interface IWindingRuleData {
    windingRule?: IWindingRule
}

export interface IBlobFunction {
    (blob: IBlob | null): void
}

export type IBlob = any