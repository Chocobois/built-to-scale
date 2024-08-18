import type { Board } from "@/components/Board";
import { Level, BlockType } from "@/components/Levels";
import { StationId } from "@/components/StationData";
import type { Station } from "@/components/Station";
import NavMesh, { buildPolysFromGridMap } from "navmesh";

const subdivision = 7;

const stationMask = [
  [true,true,true,true,true,true,true],
  [true,true,false,false,false,false,true],
  [true,false,false,false,false,true,true],
  [true,true,false,true,true,true,true],
  [true,false,false,false,false,true,true],
  [true,true,false,false,false,false,true],
  [true,true,true,true,true,true,true], 
];

function stationToGrid(board: Board, station: Station) {
  const {gridX, gridY} = board.coordToGrid(station.x, station.y);
  return [gridX, gridY];
}

function Array2DFromGrid(board: Board, subdivision: number): boolean[][] {
  console.log(board.height)
  return new Array(board.width*subdivision).fill(true).map(() => new Array(board.height*subdivision).fill(true));
}

export function centerOnSubdividedCoord(board: Board, station: Station, subdivision: number) {
  const [x, y] = stationToGrid(board, station);
  const center = Math.floor(subdivision/2);
  return [x+center, y+center];
}

const t = true;
const f = false;

function testNav() {

  const mesh = [
    [f, f, f, f, f],
    [f, t, t, t, f],
    [f, t, f, t, f],
    [f, t, t, t, f],
    [f, t, t, t, f],
    [f, f, f, f, f],
  ];

  const polys = new NavMesh(buildPolysFromGridMap(mesh));
  const path = polys.findPath(
    {x: 1, y: 1},
    {x: 3, y: 3}
  )
  console.log("new polys", )
  
}

export function GenerateNavMesh(board: Board, level: Level) {
  testNav()
  const nav = Array2DFromGrid(board, subdivision);

  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const block = level.grid[y][x];

      switch (block) {
        case BlockType.Wall:
          for(let sx = 0; sx < stationMask.length; sx++) {
            for(let sy = 0; sy < stationMask.length; sy++) {
                nav[x*subdivision + sx][y*subdivision + sy] = false;
            }
          }
          break;
        case BlockType.HornAndNails:
        case BlockType.ScalePolish:
        case BlockType.GoldBath:
          for(let sx = 0; sx < stationMask.length; sx++) {
            for(let sy = 0; sy < stationMask.length; sy++) {
              if(!stationMask[sx][sy]) {
                nav[x*subdivision + sx][y*subdivision + sy] = false;
              }
            }
          }
        //case BlockType.CashRegister:
          //this.addStation(x, y, StationId.CashRegister);
          break;
      }
    }
  }
  console.log("nav", nav)
  return new NavMesh(buildPolysFromGridMap(nav));
}