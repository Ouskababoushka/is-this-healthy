require 'sinatra'
require 'json'
require 'faraday'

post '/check_health' do
  request_data = JSON.parse(request.body.read)
  ingredients = request_data['ingredients']

  # Appel à l'API ChatGPT
  response = Faraday.post('https://api.openai.com/v1/engines/davinci/completions') do |req|
    req.headers['Content-Type'] = 'application/json'
    req.headers['Authorization'] = "Bearer YOUR_API_KEY"
    req.body = {
      prompt: "Is this healthy to consume or use? (food and cosmetic): #{ingredients.join(', ')}",
      max_tokens: 50
    }.to_json
  end

  result = JSON.parse(response.body)

  # Analyse de la réponse et attribution d'une note
  # Logique pour déterminer la note en fonction de la réponse de l'API ChatGPT
  score = determine_health_score(result['choices'][0]['text'])

  content_type :json
  { score: score }.to_json
end

def determine_health_score(response_text)
  # Logique simple pour déterminer une note (à affiner)
  case response_text.downcase
  when /very healthy/
    5
  when /healthy/
    4
  when /moderately healthy/
    3
  when /unhealthy/
    2
  when /very unhealthy/
    1
  else
    3
  end
end
