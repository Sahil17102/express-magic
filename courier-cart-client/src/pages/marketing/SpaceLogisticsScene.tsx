import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type RouteAsset = {
  curve: THREE.CatmullRomCurve3
  parcel: THREE.Mesh
  offset: number
}

export default function SpaceLogisticsScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080a0f, 0.055)

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0.25, 11)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x080a0f, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const world = new THREE.Group()
    world.position.set(2.35, -0.15, 0)
    scene.add(world)

    const globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.45, 5),
      new THREE.MeshStandardMaterial({
        color: 0x121722,
        roughness: 0.74,
        metalness: 0.18,
      }),
    )
    world.add(globe)

    const grid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.49, 3),
      new THREE.MeshBasicMaterial({
        color: 0x5f6b7c,
        transparent: true,
        opacity: 0.22,
        wireframe: true,
      }),
    )
    world.add(grid)

    const pointGeometry = new THREE.SphereGeometry(0.045, 8, 8)
    const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xc8ff3d })
    const networkPoints = [
      [1.3, 1.8, 1.15],
      [-1.7, 1.1, 1.35],
      [2.1, -0.65, 1.05],
      [-0.7, -2.1, 1.1],
      [0.1, 0.35, 2.45],
      [-2.2, -0.4, 0.85],
    ]
    networkPoints.forEach(([x, y, z]) => {
      const dot = new THREE.Mesh(pointGeometry, pointMaterial)
      dot.position.set(x, y, z)
      world.add(dot)
    })

    const routeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5c35,
      transparent: true,
      opacity: 0.78,
    })
    const parcelMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f2eb,
      roughness: 0.4,
      metalness: 0.08,
    })
    const routes: RouteAsset[] = []
    const routePoints = [
      [new THREE.Vector3(-2.1, 0.65, 1.45), new THREE.Vector3(-0.2, 3.7, 2.1), new THREE.Vector3(2.25, -0.25, 1.35)],
      [new THREE.Vector3(-1.45, -1.65, 1.35), new THREE.Vector3(0.4, 2.65, 3.3), new THREE.Vector3(1.65, 1.35, 1.45)],
      [new THREE.Vector3(-2.35, -0.45, 0.9), new THREE.Vector3(0.1, -3.8, 2.6), new THREE.Vector3(2.15, -0.8, 1.2)],
    ]

    routePoints.forEach((points, index) => {
      const curve = new THREE.CatmullRomCurve3(points)
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.012, 6, false), routeMaterial)
      world.add(tube)

      const parcel = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.13, 0.13), parcelMaterial)
      parcel.rotation.set(0.25, 0.5, 0.1)
      world.add(parcel)
      routes.push({ curve, parcel, offset: index * 0.31 })
    })

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.012, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0x8da1b9, transparent: true, opacity: 0.35 }),
    )
    ring.rotation.set(1.12, 0.22, 0.4)
    world.add(ring)

    const starsGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(900 * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 18
      positions[i + 2] = (Math.random() - 0.5) * 18
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: 0xcbd5e1, size: 0.018, transparent: true, opacity: 0.55 }),
    )
    scene.add(stars)

    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const keyLight = new THREE.DirectionalLight(0xffe5d2, 3.4)
    keyLight.position.set(-4, 5, 7)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0x5dd7ff, 22, 18)
    rimLight.position.set(5, -2, 4)
    scene.add(rimLight)

    const pointer = new THREE.Vector2()
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.7
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.45
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
      world.position.x = clientWidth < 820 ? 0.7 : 2.35
      world.position.y = clientWidth < 820 ? -1.7 : -0.15
      world.scale.setScalar(clientWidth < 540 ? 0.72 : clientWidth < 820 ? 0.88 : 1)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    const clock = new THREE.Clock()
    let animationFrame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animate = () => {
      const elapsed = clock.getElapsedTime()
      world.rotation.y += reducedMotion ? 0 : 0.0011
      world.rotation.x += (pointer.y * 0.2 - world.rotation.x) * 0.025
      world.rotation.z += (pointer.x * 0.16 - world.rotation.z) * 0.025
      stars.rotation.y = elapsed * 0.006

      routes.forEach(({ curve, parcel, offset }) => {
        const progress = reducedMotion ? offset : (elapsed * 0.065 + offset) % 1
        parcel.position.copy(curve.getPointAt(progress))
      })

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', onPointerMove)
      resizeObserver.disconnect()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach((item) => item.dispose())
          else material.dispose()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className="em-space-scene" ref={mountRef} aria-hidden="true" />
}
