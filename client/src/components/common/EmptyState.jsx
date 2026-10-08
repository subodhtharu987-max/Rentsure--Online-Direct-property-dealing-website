export default function EmptyState({ icon = '🏠', title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  )
}
