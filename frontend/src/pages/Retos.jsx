import { KaiDice } from '../components/Kai';

// Ligas, ranking y desafíos 1 vs 1 llegan en el Sprint 3 (Release 2)
export default function Retos() {
  return (
    <div className="pantalla-centro columna">
      <KaiDice>
        <h2>¡Pronto!</h2>
        <p>Aquí podrás retar a tus compañeros, subir de liga (Amauta, Panaca, Auqui, Inca) y ver el ranking semanal.</p>
      </KaiDice>
    </div>
  );
}
