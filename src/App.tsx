import React, { useState } from 'react';
import { Send, SmilePlus, Frown, Meh, Smile, Smile as SmileBeam } from 'lucide-react';

type Mood = 1 | 2 | 3 | 4 | 5;

function App() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!mood) return;

    const moodLabels: Record<Mood, string> = {
      1: 'Pas bien du tout',
      2: 'Pas très bien',
      3: 'Correct',
      4: 'Bien',
      5: 'Très bien'
    };

    try {
      const response = await fetch('http://localhost:3000/api/submit-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: moodLabels[mood],
          comment
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      
      setSubmitted(true);
      setTimeout(() => {
        setMood(null);
        setComment('');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    }
  };

  const moodIcons = {
    1: <Frown className="w-12 h-12" />,
    2: <Meh className="w-12 h-12" />,
    3: <Smile className="w-12 h-12" />,
    4: <SmileBeam className="w-12 h-12" />,
    5: <SmilePlus className="w-12 h-12" />,
  };

  const moodLabels = {
    1: 'Pas bien du tout',
    2: 'Pas très bien',
    3: 'Correct',
    4: 'Bien',
    5: 'Très bien',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Baromètre du bien-être
            </h1>
            <p className="text-gray-600">
              Partagez votre ressenti de la semaine de manière anonyme
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-green-600 text-xl mb-2">
                Merci pour votre retour !
              </div>
              <p className="text-gray-600">
                Votre réponse a été enregistrée anonymement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Comment vous sentez-vous cette semaine ?
                </label>
                <div className="flex justify-between items-center gap-2">
                  {([1, 2, 3, 4, 5] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMood(value)}
                      className={`p-3 rounded-lg transition-all ${
                        mood === value
                          ? 'bg-indigo-100 scale-110'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {moodIcons[value]}
                        <span className="text-xs text-gray-600">
                          {moodLabels[value]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Un commentaire à partager ? (optionnel)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  placeholder="Partagez vos impressions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!mood}
                className={`w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white 
                  ${
                    mood
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                <Send className="w-4 h-4" />
                Envoyer mon retour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;