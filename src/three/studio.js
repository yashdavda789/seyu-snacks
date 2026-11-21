/**
 * The 3D product studio.
 *
 * One WebGL context serves the whole site: it renders each product to a still
 * thumbnail on load, and the same context is handed to the 360 modal when a
 * product is opened. Nothing here is a photograph - every snack is geometry.
 *
 * To change how a snack looks, edit FOOD (its shape), TONES (its colour) or
 * SETTLE (how it piles). To change the serving dish, edit VESSELS.
 */
import * as THREE from 'three'

const THUMB = 460

/* ------------------------------------------------------------------ colour */

export const TONES = {
  golden: [0xc98a28, 0xb0701a, 0xdda648, 0x9c5e10, 0xd09333, 0xba7d22, 0xe2b45c, 0x8e5309],
  deep: [0xa85e12, 0x924c0c, 0xbe7a22, 0x7e3c06, 0xb06818, 0x9a560e, 0xc98a32, 0x6e3204],
  pale: [0xdcb85e, 0xcea446, 0xe8c877, 0xc0922e, 0xd6ae52, 0xc89c3c, 0xefd28a, 0xb8882a],
  green: [0x7e8a32, 0x667424, 0x94a046, 0x546218, 0x87933b, 0x707e2a, 0xa2ac5a, 0x485614],
  red: [0xb2460f, 0x9a3608, 0xc45a1c, 0x822a04, 0xa93e0e, 0x923206, 0xcd6828, 0x702004],
  cream: [0xd4be8c, 0xc4ac76, 0xe2cfa2, 0xb49c66, 0xccb684, 0xbca474, 0xeadbb0, 0xaa9258],
}

const BRASS = 0xb98a2c

/* ------------------------------------------------------------------- shapes */

function curveTube(seed, len, rad, wob) {
  const pts = []
  for (let i = 0; i < 6; i++) {
    const t = i / 5
    pts.push(
      new THREE.Vector3(
        (t - 0.5) * len,
        Math.sin(t * 5 + seed) * wob,
        Math.cos(t * 4.2 + seed * 1.7) * wob,
      ),
    )
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 9, rad, 5, false)
}

/** Each builder returns one of 8 variants, so a pile never looks stamped out. */
export const FOOD = {
  strand: (v) => curveTube(v + 1, 0.5 + (v % 5) * 0.11, 0.027, 0.055),
  stick: (v) => curveTube(v + 1, 0.62 + (v % 4) * 0.13, 0.055, 0.03),

  bead: (v) => {
    const g = new THREE.SphereGeometry(0.075 + (v % 4) * 0.012, 12, 10)
    g.scale(1, 0.88, 1)
    return g
  },

  bean: (v) => {
    const g = new THREE.SphereGeometry(0.085 + (v % 3) * 0.014, 12, 10)
    g.scale(1.25, 0.52, 0.92)
    return g
  },

  disc: (v) => {
    const r = 0.3 + (v % 4) * 0.045
    return new THREE.CylinderGeometry(r, r * 0.97, 0.072, 22)
  },

  diamond: (v) => {
    const s = 0.22 + (v % 4) * 0.035
    return new THREE.BoxGeometry(s, 0.075, s * 1.45)
  },

  crescent: (v) => {
    const g = new THREE.TorusGeometry(0.26 + (v % 3) * 0.04, 0.085, 10, 22, Math.PI * 1.05)
    g.scale(1, 1, 0.72)
    return g
  },

  cashew: (v) => {
    const g = new THREE.TorusGeometry(0.2 + (v % 3) * 0.028, 0.062, 10, 20, Math.PI * 1.25)
    g.scale(1, 1, 0.8)
    return g
  },

  spiral: (v) => {
    const pts = []
    const R = 0.3 + (v % 3) * 0.05
    for (let i = 0; i <= 54; i++) {
      const t = i / 54
      const a = t * 2.6 * Math.PI * 2
      const r = R * (0.16 + 0.84 * t)
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(t * 3) * 0.015, Math.sin(a) * r))
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.045, 5, false)
  },

  wheel: (v) => {
    const r = 0.24 + (v % 4) * 0.035
    return new THREE.CylinderGeometry(r, r, 0.17, 20)
  },

  // a genuine mixture: flake, peanut, strand, lentil
  mix: (v) => {
    const m = v % 4
    let g
    if (m === 0) {
      g = new THREE.SphereGeometry(0.1, 10, 8)
      g.scale(1.5, 0.3, 1.1)
      return g
    }
    if (m === 1) {
      g = new THREE.SphereGeometry(0.082, 12, 10)
      g.scale(1.35, 0.85, 0.85)
      return g
    }
    if (m === 2) return curveTube(v + 1, 0.38, 0.028, 0.04)
    return new THREE.CylinderGeometry(0.075, 0.075, 0.042, 14)
  },
}

/** tilt = how far from flat each piece settles; count = pieces per variant */
export const SETTLE = {
  strand: { tilt: 0.66, count: 230, h: 0.72 },
  stick: { tilt: 0.5, count: 150, h: 0.68 },
  bead: { tilt: 3.14, count: 260, h: 0.6 },
  bean: { tilt: 0.55, count: 220, h: 0.56 },
  disc: { tilt: 0.42, count: 95, h: 0.6 },
  diamond: { tilt: 0.5, count: 110, h: 0.6 },
  crescent: { tilt: 0.7, count: 90, h: 0.64 },
  cashew: { tilt: 0.8, count: 120, h: 0.6 },
  spiral: { tilt: 0.34, count: 55, h: 0.52 },
  wheel: { tilt: 0.45, count: 110, h: 0.62 },
  mix: { tilt: 1.0, count: 210, h: 0.7 },
}

/* ------------------------------------------------------------------ helpers */

const food = (col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.82, metalness: 0 })
const brass = (col = BRASS, roughness = 0.3) =>
  new THREE.MeshStandardMaterial({ color: col, roughness, metalness: 0.92 })
const matte = (col, roughness = 0.85, metalness = 0.1) =>
  new THREE.MeshStandardMaterial({ color: col, roughness, metalness })

/* ----------------------------------------------------------------- vessels */

function thali(group) {
  const p = new THREE.Mesh(new THREE.CylinderGeometry(3.15, 3.0, 0.14, 64), brass(BRASS, 0.29))
  p.position.y = -0.72
  group.add(p)

  const r = new THREE.Mesh(new THREE.TorusGeometry(3.12, 0.1, 12, 72), brass(BRASS, 0.22))
  r.rotation.x = Math.PI / 2
  r.position.y = -0.66
  group.add(r)

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.62, 48),
    new THREE.MeshBasicMaterial({ color: 0x3a2208, transparent: true, opacity: 0.17 }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.643
  group.add(shadow)
}

function tinVessel(group, accent) {
  const t = new THREE.Group()
  group.add(t)

  const lower = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.46, 0.62, 56),
    new THREE.MeshStandardMaterial({ color: accent, roughness: 0.42, metalness: 0.25 }),
  )
  lower.position.y = -0.3
  t.add(lower)

  const band = new THREE.Mesh(new THREE.CylinderGeometry(1.53, 1.53, 0.56, 56), brass(BRASS, 0.26))
  band.position.y = 0.2
  t.add(band)

  // the ivory arch pattern around the band
  const archGeo = new THREE.CircleGeometry(0.1, 16, 0, Math.PI)
  const archMat = matte(0xe0cda4, 0.6, 0.08)
  archMat.side = THREE.DoubleSide
  const dotMat = matte(0x1e0e05, 0.65, 0.08)
  for (let a = 0; a < 28; a++) {
    const ang = (a / 28) * Math.PI * 2
    const arch = new THREE.Mesh(archGeo, archMat)
    arch.position.set(Math.cos(ang) * 1.542, 0.16, Math.sin(ang) * 1.542)
    arch.rotation.y = -ang + Math.PI / 2
    t.add(arch)
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), dotMat)
    dot.position.set(Math.cos(ang) * 1.552, 0.19, Math.sin(ang) * 1.552)
    t.add(dot)
  }

  const up = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 56), brass(BRASS, 0.3))
  up.position.y = 0.66
  t.add(up)

  for (const [y, rad] of [
    [-0.62, 1.47],
    [0.49, 1.5],
    [0.9, 1.51],
  ]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.055, 10, 64), brass(BRASS, 0.2))
    ring.rotation.x = Math.PI / 2
    ring.position.y = y
    t.add(ring)
  }

  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(1.44, 1.3, 1.5, 48, 1, true),
    matte(0x3a2208, 0.9, 0.1),
  )
  inner.material.side = THREE.BackSide
  inner.position.y = 0.1
  t.add(inner)

  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.44, 48), matte(0x6b4512, 0.85, 0.2))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.55
  t.add(floor)

  // lid, resting off to one side
  const lid = new THREE.Group()
  lid.add(new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.5, 0.17, 56), brass(BRASS, 0.3)))
  const lr = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.06, 10, 64), brass(BRASS, 0.22))
  lr.rotation.x = Math.PI / 2
  lr.position.y = -0.07
  lid.add(lr)
  const knob = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.055, 10, 36), brass(BRASS, 0.25))
  knob.rotation.x = Math.PI / 2.6
  knob.position.y = 0.16
  lid.add(knob)
  lid.position.set(2.72, -0.5, 1.05)
  lid.rotation.set(0.1, 0, -0.16)
  group.add(lid)

  return { fillY: 0.6, fillR: 1.44 }
}

function bowlVessel(group) {
  const b = new THREE.Group()
  group.add(b)

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.62, 48, 32, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
    brass(0xc1912f, 0.26),
  )
  body.position.y = 0.18
  b.add(body)

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 48, 32, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5),
    matte(0x4a2c0c, 0.85, 0.15),
  )
  inner.material.side = THREE.BackSide
  inner.position.y = 0.18
  b.add(inner)

  const lip = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.075, 12, 64), brass(0xc1912f, 0.2))
  lip.rotation.x = Math.PI / 2
  lip.position.y = 0.18
  b.add(lip)

  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.16, 32), brass(0xa87b22, 0.3))
  foot.position.y = -1.42
  b.add(foot)

  return { fillY: 0.1, fillR: 1.5 }
}

function heapVessel(group) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.085, 12, 64), brass(0xa87b22, 0.26))
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.6
  group.add(ring)

  const scoop = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.4, 0.1, 24), brass(0xc1912f, 0.24))
  scoop.position.set(2.45, -0.6, 0.9)
  scoop.rotation.z = 0.06
  group.add(scoop)

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 1.25, 12),
    brass(0xc1912f, 0.26),
  )
  handle.position.set(2.5, -0.46, 1.95)
  handle.rotation.x = 1.35
  group.add(handle)

  return { fillY: -0.56, fillR: 1.95, hMul: 1.5 }
}

export const VESSELS = [tinVessel, bowlVessel, heapVessel]

/* ---------------------------------------------------------------- backdrop */

/** Warm radial sweep behind the product, drawn once into a canvas texture. */
function backdrop() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(205, 174, 20, 256, 256, 340)
  grad.addColorStop(0, '#FFF3DD')
  grad.addColorStop(0.55, '#F4D9A8')
  grad.addColorStop(1, '#D9B176')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 512)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Metal is mostly reflection, so brass with nothing to reflect renders black.
 * This is the room it reflects: a warm sky, a dark floor, a bright key above
 * the left shoulder and a hot rim behind. Painted, then prefiltered by
 * PMREMGenerator into a proper environment map.
 */
function envEquirect() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')

  const sky = g.createLinearGradient(0, 0, 0, 512)
  sky.addColorStop(0, '#FFF8EC')
  sky.addColorStop(0.44, '#EFD2A4')
  sky.addColorStop(0.58, '#8A6640')
  sky.addColorStop(1, '#2A1A0C')
  g.fillStyle = sky
  g.fillRect(0, 0, 1024, 512)

  const key = g.createRadialGradient(300, 100, 8, 300, 100, 200)
  key.addColorStop(0, 'rgba(255,255,255,1)')
  key.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = key
  g.fillRect(0, 0, 1024, 512)

  const rim = g.createRadialGradient(830, 170, 8, 830, 170, 170)
  rim.addColorStop(0, 'rgba(255,150,70,0.92)')
  rim.addColorStop(1, 'rgba(255,150,70,0)')
  g.fillStyle = rim
  g.fillRect(0, 0, 1024, 512)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ------------------------------------------------------------------ studio */

class Studio {
  constructor() {
    this.ok = false
    this.renderer = null
    this.raf = null
    this.spin = { dragging: false, tilt: 0, vel: 0, auto: true }
    this.dummy = new THREE.Object3D()
  }

  init() {
    if (this.renderer || this.ok === 'failed') return this.ok
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true, // needed for toDataURL thumbnails
      })
    } catch {
      this.ok = 'failed'
      return false
    }
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.76

    this.scene = new THREE.Scene()
    // Baked into the render rather than left to CSS: thumbnails are flattened
    // to JPEG, which has no alpha, so a transparent canvas would come out black.
    this.scene.background = backdrop()

    // gives the brass something to reflect
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    pmrem.compileEquirectangularShader()
    const src = envEquirect()
    this.scene.environment = pmrem.fromEquirectangular(src).texture
    src.dispose()
    pmrem.dispose()

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    this.camera.position.set(0, 4.3, 11.6)
    this.camera.lookAt(0, 0.05, 0)

    // All directional, so intensities behave the same across three versions.
    this.scene.add(new THREE.AmbientLight(0xffe8cc, 0.5))
    this.scene.add(new THREE.HemisphereLight(0xffebcc, 0x3a1e10, 0.6))
    const key = new THREE.DirectionalLight(0xfff0dc, 2.4)
    key.position.set(4.6, 8.2, 4.6)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xff7a3c, 1.0)
    rim.position.set(-4.8, 3.4, -4)
    this.scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffd9a0, 0.5)
    fill.position.set(2.8, 1.4, 5)
    this.scene.add(fill)

    this.rig = new THREE.Group()
    this.scene.add(this.rig)

    this.ok = true
    return true
  }

  get canvas() {
    return this.renderer?.domElement ?? null
  }

  clearRig() {
    while (this.rig.children.length) {
      const child = this.rig.children.pop()
      child.traverse((o) => {
        o.geometry?.dispose()
        if (o.material) {
          const list = Array.isArray(o.material) ? o.material : [o.material]
          list.forEach((m) => m.dispose())
        }
      })
    }
  }

  pile(kind, tones, cx, cy, cz, radius, height, count) {
    const cfg = SETTLE[kind] ?? SETTLE.mix
    const build = FOOD[kind] ?? FOOD.mix
    for (let v = 0; v < 8; v++) {
      const mesh = new THREE.InstancedMesh(build(v), food(tones[v]), count)
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const rr = Math.sqrt(Math.random()) * radius
        const dome = Math.sqrt(Math.max(0, 1 - (rr / radius) ** 2)) * height
        this.dummy.position.set(
          cx + Math.cos(a) * rr,
          cy + Math.random() * dome,
          cz + Math.sin(a) * rr,
        )
        this.dummy.rotation.set(
          (Math.random() - 0.5) * cfg.tilt,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * cfg.tilt,
        )
        const s = 0.86 + Math.random() * 0.36
        this.dummy.scale.set(s, s, s)
        this.dummy.updateMatrix()
        mesh.setMatrixAt(i, this.dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
      this.rig.add(mesh)
    }
  }

  compose(product) {
    this.clearRig()
    thali(this.rig)
    const vessel = VESSELS[product.vessel % VESSELS.length]
    const info = vessel(this.rig, product.accent)
    const tones = TONES[product.tone] ?? TONES.golden
    const cfg = SETTLE[product.kind] ?? SETTLE.mix
    const hMul = info.hMul ?? 1

    this.pile(
      product.kind,
      tones,
      0,
      info.fillY,
      0,
      info.fillR,
      cfg.h * hMul,
      Math.round(cfg.count * (info.hMul ? 1.5 : 1)),
    )
    // a little spilled on the thali, so it reads as a shop counter
    this.pile(product.kind, tones, 0, -0.62, 0, 2.5, 0.04, 7)
    this.rig.rotation.set(0, -0.55, 0)
  }

  /** Render one product to a still JPEG data URL. */
  thumbnail(product) {
    if (!this.init()) return null
    this.compose(product)
    this.renderer.setSize(THUMB, THUMB, false)
    this.camera.aspect = 1
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
    return this.renderer.domElement.toDataURL('image/jpeg', 0.84)
  }

  /** Put the live canvas into `el` and start spinning `product`. */
  attach(el, product, { reducedMotion = false } = {}) {
    if (!this.init()) return
    this.compose(product)
    this.spin = { dragging: false, tilt: 0, vel: 0, auto: !reducedMotion }
    el.appendChild(this.renderer.domElement)
    this.resize()
    if (!this.raf) this.loop()
  }

  detach() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
    this.canvas?.parentNode?.removeChild(this.canvas)
  }

  resize() {
    const box = this.canvas?.parentNode
    if (!box) return
    const { clientWidth: w, clientHeight: h } = box
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const s = this.spin
    if (!s.dragging) {
      if (s.auto) this.rig.rotation.y += 0.0032
      else if (Math.abs(s.vel) > 0.00004) {
        this.rig.rotation.y += s.vel
        s.vel *= 0.945
      }
    }
    this.rig.rotation.x += (s.tilt - this.rig.rotation.x) * 0.1
    this.renderer.render(this.scene, this.camera)
  }

  dragStart() {
    this.spin.dragging = true
    this.spin.auto = false
  }

  dragBy(dx, dy) {
    if (!this.spin.dragging) return
    this.rig.rotation.y += dx * 0.0115
    this.spin.tilt = Math.max(-0.45, Math.min(0.55, this.spin.tilt + dy * 0.006))
    this.spin.vel = dx * 0.0011
  }

  dragEnd() {
    this.spin.dragging = false
  }

  nudge(dir) {
    this.spin.auto = false
    this.rig.rotation.y += dir * 0.14
  }

  tiltBy(d) {
    this.spin.tilt = Math.max(-0.45, Math.min(0.55, this.spin.tilt + d))
  }
}

export const studio = new Studio()
